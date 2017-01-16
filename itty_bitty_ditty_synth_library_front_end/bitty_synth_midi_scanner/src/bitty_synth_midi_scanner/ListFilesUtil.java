/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bitty_synth_midi_scanner;

import java.io.File;
import java.util.ArrayList;
/**
 * Contains some methods to list files and folders from a directory
 *
 * @author Loiane Groner
 * http://loiane.com (Portuguese)
 * http://loianegroner.com (English)
 */
public class ListFilesUtil {
    /**
     * List all the files and folders from a directory
     * @param directoryName to be listed
     */
    public void listFilesAndFolders(String directoryName){
        File directory = new File(directoryName);
        //get all the files from a directory
        File[] fList = directory.listFiles();
        for (File file : fList){
            System.out.println(file.getName());
        }
    }
    /**
     * List all the files under a directory
     * @param directoryName to be listed
     */
    public void listFiles(String directoryName){
        File directory = new File(directoryName);
        //get all the files from a directory
        File[] fList = directory.listFiles();
        for (File file : fList){
            if (file.isFile()){
                System.out.println(file.getName());
            }
        }
    }
    /**
     * List all the folder under a directory
     * @param directoryName to be listed
     */
    public void listFolders(String directoryName){
        File directory = new File(directoryName);
        //get all the files from a directory
        File[] fList = directory.listFiles();
        for (File file : fList){
            if (file.isDirectory()){
                System.out.println(file.getName());
            }
        }
    }
    /**
     * List all files from a directory and its subdirectories
     * @param directoryName to be listed
     * @return 
     */
    public static ArrayList listFilesAndFilesSubDirectories(String directoryName){
        ArrayList<String> returnA = new ArrayList(); 
        
        File directory = new File(directoryName);
        //get all the files from a directory
        File[] fList = directory.listFiles();
        for (File file : fList){
            if (file.isFile()){
                returnA.add(file.getAbsolutePath());
            } else if (file.isDirectory()){
                ArrayList<String> res = listFilesAndFilesSubDirectories(file.getAbsolutePath());
                returnA.addAll(res); 
            }
        }
        
        return returnA; 
    }
    
    public static void main (String[] args){
        ListFilesUtil listFilesUtil = new ListFilesUtil();
        final String directoryLinuxMac ="/Users/loiane/test";
        //Windows directory example
        final String directoryWindows ="C://test";
        listFilesUtil.listFiles(directoryLinuxMac);
    }
}