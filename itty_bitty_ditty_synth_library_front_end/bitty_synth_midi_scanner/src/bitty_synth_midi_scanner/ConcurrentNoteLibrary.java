/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bitty_synth_midi_scanner;

import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * This class has two STATIC methods: 
 *      - getConcurrentNotesFromNoteA: returns a library of concurrencies from an individual song
 *      - getConcurrentNotesFromNoteAString: when used with getConcurrentNotesFromNoteA, returns an easy to read output
 * This class also is used as a DYNAMIC class:
 *      - Constructor creates a new ConcurrentNoteLibrary
 *      - addToLibrary adds an MIDI file to the library
 *      - getLibrary gets the library
 *      - concatLibrary adds an input library to this library
 *      - getJavaScriptString returns a javascript array declaration for the library
 * @author kenneth
 */
public class ConcurrentNoteLibrary {
    
    /**
     * Produces a library of int[][] of notes. 
     * The return array returnArr[noteNumber][noteNumberConcurrent] = n is the 
     * number n, of occurrences noteNumberConcurrent (0 - 127) appears concurrently 
     * with note noteNumber in the song input. 
     * @param input
     * @return 
     */
    public static int[][] getConcurrentNotesFromNoteA(ArrayList[] input) {
        int[][] returnInt = new int[128][128]; 
        
        // Cycle thru all beats in a song. 
        for (int i = 0; i < input.length; i++) {
            if (input[i] != null){
                // Cycle thru all notes in a beat in a song. 
                for (int j = 0; j < input[i].size(); j++){
                    // The current note is input[i].get(j)
                    int cNote = (Integer) input[i].get(j); 
                    // Cycle thru all other notes to create concurrency library. 
                    for (Object k : input[i]) {
                        Integer oNote = (Integer) k; 
                        // If the other note is not the current note, then add
                        // to the concurrency library. 
                        if (cNote != oNote) returnInt[cNote][oNote] ++; 
                    }
                }
            }
        }
        
        return returnInt; 
    }
    
    /**
     * Returns a string of the result of getConcurrentNotesFromNoteA for easier output. 
     * @param input
     * @return 
     */
    public static String getConcurrentNotesFromNoteAString(int[][] input) {
        String retString = ""; 
        for (int i = 0; i < 128; i++) {
            for (int j = 0; j < 128; j++) {
                if (input[i][j] != 0) {
                    retString += "Note " + Integer.toString(i) + " is concurrent with " + Integer.toString(j) + " for " + Integer.toString(input[i][j]) + " times. ";
                    retString += "\n"; 
                } 
                
            }
        }
        return retString; 
    }
    
    public String getJavaScriptString() {
        String retString = "var dArray = [\n"; 
        
        for (int i = 0; i < 128; i++) {
            retString += "\t["; 
            for (int j = 0; j < 128; j++) {
                
                    retString += this.getLibrary()[i][j] + ", ";
                
                
            }
            if ("[".charAt(0)!= retString.charAt(retString.length() - 1)) retString = retString.substring(0, retString.length() - 2); 
            retString += "],\n"; 
        }
        retString = retString.substring(0, retString.length() - 1); 
        
        return retString + "\n];"; 
    }
    
    /**
     * This array represents the concurrentnotelibrary this instance holds. 
     */
    private final int[][] thisLibrary; 
    
    /**
     * Constructs an empty ConcurrentNoteLibrary. 
     */
    public ConcurrentNoteLibrary() {
        thisLibrary = new int[128][128]; 
    }
    
    /**
     * Adds a song to this ConcurrentNoteLibrary. 
     * @param fName 
     * @param tempo 
     */
    public void addToLibrary(String fName, int tempo) {
        try { 
            concatLibrary(ConcurrentNoteLibrary.getConcurrentNotesFromNoteA(MidiScanner.getNotesA(fName, tempo)));
        } catch (Exception ex) {
            Logger.getLogger(ConcurrentNoteLibrary.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    /**
     * Returns this library. 
     * @return 
     */
    public int[][] getLibrary() {
        return thisLibrary; 
    }
    
    /** 
     * This method combines an input library to the current library. 
     * @param input 
     */
    private void concatLibrary(int[][] input) {
        for (int i = 0; i < 128; i++) {
            for (int j = 0; j < 128; j++) {
                this.thisLibrary[i][j] += input[i][j]; 
            }
        }
    }
}
