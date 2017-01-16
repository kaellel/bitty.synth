/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bitty_synth_midi_scanner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 * @author k_nn_
 */
public class PatternLibrary {
    
    /**
     * Returns repeated patterns in the song defined by input. 
     * @param input
     * @return The ArrayList represents frames and frame contents. 
     */
    public static ArrayList getPatternFromSongA(ArrayList[][] input) {
        return getPatternFromSongA(input, null); 
    }
    public static ArrayList getPatternFromSongA(String sString) {
        return getPatternFromSongA(null, sString); 
    }
    public static ArrayList getPatternFromSongA(ArrayList[][] input, String sString) {
        // Approach: convert the array to a string, and then find the longest repeated substring. 
        ArrayList<String> resList = new ArrayList(); 
        
        // First trim out all empty frames before and after a song to prevent erroneous results. 
        String songString = ""; 
        if (input!=null)
            songString = MidiScanner.trimGetNotesMultiTrackAString(MidiScanner.getNotesMultiTrackAString(input)); 
        if (sString!=null)
            songString = sString; 

        // Next, for each actual track, find patterns. 
        String[] splitted = songString.split("\n"); 
        for (int i = 1; i < splitted.length; i += 3) {
            if (!splitted[i].equals("")) {
                if (!splitted[i].startsWith(";")) {
                    splitted[i] = ";" + splitted[i]; 
                }
                /*
                Code to find patterns within splitted[i]. 
                LRS does not work the best since it finds the longest repeated 
                substring, not the most repeated substring. 
                */
                
                /*
                New approach: find repeatedly occuring substrings with matching numbers of "[" and "]", and add them 
                all to the arraylist. 
                */
                
                
                // First find every valid substring and place into an ArrayList.                 
                List<String> subStrs = new ArrayList(); 
                String str = splitted[i]; 
                for (int c = 0 ; c < str.length(); c++) {
                    for (int j = 1 ; j <= str.length() - c ; j++) {
                        String sub = str.substring(c, c+j);
                        if (validSubstring(sub)) {
                            subStrs.add(MidiScanner.tTrim(sub.trim()));
                        } 
                    }
                }
                
                
                // Remove repeated elements in the ArrayList. 
                subStrs = subStrs.stream().distinct().collect(Collectors.toList());
                          
                // Remove all single-framed contents. 
                Iterator<String> iter = subStrs.iterator();
                while(iter.hasNext()){
                    String testStr = iter.next(); 
                    if (testStr.split(";").length <= 3) iter.remove();
                }
                
                // Next, create an ArrayList of the occurences. 
                ArrayList<Integer> occurrences = new ArrayList(); 
                for (String s : subStrs) {
                    occurrences.add(countOccurrences(str, s));
                }
                
                
                // Remove all single occurrence substrings. 
                for (int j = 0; j < occurrences.size(); j++) {
                    if (occurrences.get(j) < 2) {
                        occurrences.remove(j); 
                        subStrs.remove(j); 
                        j--; 
                    }
                }
                
                
                /*
                Then, eliminate all elements in the arraylist that are contained by other elements in the array list. 
                */
                for (int j = 0; j < subStrs.size(); j++) {
                    String testForContains = subStrs.get(j); 
                    boolean MarkedForDeletion = false; 
                    for (int k = 0; k < subStrs.size(); k++) {
                        String testAgainst = subStrs.get(k); 
                        if (testAgainst.contains(testForContains) && !testAgainst.equals(testForContains)) MarkedForDeletion = true; 
                    }
                    if (MarkedForDeletion) {
                        subStrs.remove(j); 
                        j--; 
                    }
                }
                
                resList.addAll(0, subStrs); 
            }
        }
        
        return resList; 
    }
    
    /**
     * Returns an easily readable string for use with getPatternFromSongA. 
     * @param resList
     * @return 
     */
    public static String getPatternFromSongAString(ArrayList<String> resList) {
        String resString = ""; 
        for (String s: resList) {
            resString += s + "\n"; 
        }
        return resString; 
    }
    
    /**
     * Helper method to count the occurrences of a substring inside a string. 
     * @param str
     * @param findStr
     * @return 
     */
    public static int countOccurrences(String str, String findStr) {
        int lastIndex = 0;
        int count = 0;
        while(lastIndex != -1){
            lastIndex = str.indexOf(findStr,lastIndex);
            if(lastIndex != -1){
                count ++;
                lastIndex += findStr.length();
            }
        }
        return count; 
    }
    
    /**
     * Helper method that finds the most occurred substring inside a string. 
     * If there are equal numbers, then the longest is returned. 
     * @param str
     * @return 
     */
    private static String mostOccurredSubstring(String str) {
        // First find every substring and place into an ArrayList. 
        ArrayList<String> subStrs = new ArrayList(); 
        for (int c = 0 ; c < str.length(); c++) {
            for (int i = 1 ; i <= str.length() - c ; i++) {
                String sub = str.substring(c, c+i);
                if (sub.length() > 1) subStrs.add(sub); 
            }
        }
        // Next, create a similar ArrayList of the occurences. 
        ArrayList<Integer> occurrences = new ArrayList(); 
        for (String s : subStrs) {
            occurrences.add(countOccurrences(str, s));
        }
        // Find the largest number in occurrences
        int mostOccurrences = Collections.max(occurrences); 
        int indexOfMostOccurrences = occurrences.indexOf(mostOccurrences); 
        
        return subStrs.get(indexOfMostOccurrences); 
    }
    
    public static boolean validSubstring(String input) {
        /*
        input = input.replaceAll("\\[\\]\\*", ""); 
        String[] eachNote = input.split("\\*"); 
        boolean isValid = true; 
        if (input.endsWith("*"))
            isValid = false; 
        for (String s : eachNote) {
            if (s == "" || countOccurrences(s, "[") < 1 || countOccurrences(s, "[")!=countOccurrences(s, "]")) isValid = false; 
        }
        
        return isValid; 
        */
        boolean isValid = input.endsWith(";") && input.startsWith(";") && !input.endsWith(",") && !input.startsWith(",");  
        isValid = isValid && input.split(";").length > 3; 
        
        return isValid; 
    }
    
    /**
     * Returns a JS capable string for use with getPatternFromSongA. 
     * @param resList
     * @return 
     */
    public static String getPatternFromSongAJS(ArrayList<String> resList) {
        String resString = "var patternLibrary" + (new java.util.Date()).toString().replaceAll(":", "").replaceAll(" ", "") + " = [\n"; 
        for (String s: resList) {
            resString += "\t\"" + s + "\",\n" ; 
        }
        return resString.substring(0, resString.length() - 2) + "\n]; "; 
    }
}
