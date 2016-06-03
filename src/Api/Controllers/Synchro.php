<?php
namespace PushEDX\Chat\Api\Controllers;

use \stdClass;

class Synchro
{

   private $_file;

   public function __construct($file)
   {
       $this->_file = $file;
   }

   public function __get($property)
   {
       // File does not exist
       if (!is_file($this->_file))
       {
           return null;
       }

       // Check if file is readable
       if ((is_file($this->_file)) && (!is_readable($this->_file)))
       {
           throw new Exception(sprintf("File '%s' is not readable.", $this->_file));
       }

       // Open file with advisory lock option enabled for reading and writting
       if (($fd = fopen($this->_file, 'c+')) === false)
       {
           throw new Exception(sprintf("Can't open '%s' file.", $this->_file));
       }

       // Request a lock for reading (hangs until lock is granted successfully)
       if (flock($fd, LOCK_SH) === false)
       {
           throw new Exception(sprintf("Can't lock '%s' file for reading.", $this->_file));
       }

       // A hand-made file_get_contents
       $contents = '';
       while (($read = fread($fd, 32 * 1024)) !== '')
       {
           $contents .= $read;
       }

       // Release shared lock and close file
       flock($fd, LOCK_UN);
       fclose($fd);

       // Restore shared data object and return requested property
       $object = json_decode($contents);
       if (property_exists($object, $property))
       {
           return $object->{$property};
       }

       return null;
   }

   public function __set($property, $value)
   {
       // Check if directory is writable if file does not exist
       if ((!is_file($this->_file)) && (!is_writable(dirname($this->_file))))
       {
           throw new Exception(sprintf("Directory '%s' does not exist or is not writable.", dirname($this->_file)));
       }

       // Check if file is writable if it exists
       if ((is_file($this->_file)) && (!is_writable($this->_file)))
       {
           throw new Exception(sprintf("File '%s' is not writable.", $this->_file));
       }

       // Open file with advisory lock option enabled for reading and writting
       if (($fd = fopen($this->_file, 'c+')) === false)
       {
           throw new Exception(sprintf("Can't open '%s' file.", $this->_file));
       }

       // Request a lock for writting (hangs until lock is granted successfully)
       if (flock($fd, LOCK_EX) === false)
       {
           throw new Exception(sprintf("Can't lock '%s' file for writing.", $this->_file));
       }

       // A hand-made file_get_contents
       $contents = '';
       while (($read = fread($fd, 32 * 1024)) !== '')
       {
           $contents .= $read;
       }

       // Restore shared data object and set value for desired property
       if (empty($contents))
       {
           $object = new stdClass();
       }
       else
       {
           $object = json_decode($contents);
       }
       $object->{$property} = $value;

       // Go back at the beginning of file
       rewind($fd);

       // Truncate file
       ftruncate($fd, strlen($contents));

       // Save shared data object to the file
       fwrite($fd, json_encode($object));

       // Release exclusive lock and close file
       flock($fd, LOCK_UN);
       fclose($fd);

       return $value;
   }

}
