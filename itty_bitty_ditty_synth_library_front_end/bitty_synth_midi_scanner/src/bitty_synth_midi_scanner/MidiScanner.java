/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bitty_synth_midi_scanner;

import java.io.File;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.sound.midi.MidiEvent;
import javax.sound.midi.MidiMessage;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.Sequence;
import javax.sound.midi.ShortMessage;
import javax.sound.midi.Track;

/**
 * getNotes: returns a Bitty.Synth song string that can be btoa'ed and then imported into Bitty.Synth
 * getNotesA: returns an Array[indexOfBeat] = notesList<Integer> representation of a song
 * getNotesAString: when used with getNotesA, returns an easy to read string of the contents of the song
 * getNotesMultiTrackA: returns an Array[indexOfTrack][indexOfBeat] = notesList<Integer> representation of a song
 * getNotesMultiTrackAString: when used with getNotesMultiTrackA, returns an easy to read string of the contents of the song
 * trimGetNotesMultiTrackAString: Trims away empty frames of a string produced by getNotesMultiTrackAString
 * @author kenneth
 */
public class MidiScanner {
    public static final int NOTE_ON = 0x90;
    public static final int NOTE_OFF = 0x80;
    public static final String[] NOTE_NAMES = {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"};
    
    /**
     * Returns a BittySongDefinition of all notes in an MIDI file. The ret
     * urned song only puts notes onto the first canvas.
     * @param fName
     * @return
     * @throws Exception 
     */
    public static BittySongDefinition getNotes(String fName, int tempo) throws Exception {
        BittySongDefinition returnSong = new BittySongDefinition(); 
        Sequence sequence = MidiSystem.getSequence(new File(fName));

        // Below are calculations for basic MIDI file informations. 
        int milliSecondLength = (int) (sequence.getMicrosecondLength() / (1000.0)); 
        int bpm = (int) (sequence.getTickLength() / (milliSecondLength / 1000.0 / 60.0) / (sequence.getResolution() / tempo)); 
        
        returnSong.Cvs1BPM = bpm; 
        
        int trackNumber = 0;
        for (Track track :  sequence.getTracks()) {
            trackNumber++;
            for (int i=0; i < track.size(); i++) { 
                MidiEvent event = track.get(i);
                // Each "Beat" should represent a frame in bitty.synth. 
                MidiMessage message = event.getMessage();
                if (message instanceof ShortMessage) {
                    ShortMessage sm = (ShortMessage) message;
                    if (sm.getCommand() == NOTE_ON) {
                        int key = sm.getData1();
                        int octave = (key / 12)-1;
                        int note = key % 12;
                        String noteName = NOTE_NAMES[note];
                        int velocity = sm.getData2();
                        
                        // Add note information 
                        try {
                            if (velocity>0) {
                                if (returnSong.Cvs1[(int) (event.getTick() / (sequence.getResolution() / tempo))]==null) 
                                    returnSong.Cvs1[(int) (event.getTick() / (sequence.getResolution() / tempo))] = "{"; 
                                returnSong.Cvs1[(int) (event.getTick() / (sequence.getResolution() / tempo))] += key + ","; 
                            }
                        }
                        catch (Exception e) {
                        }
                    } 
                } else {
                }
            }
        }
        
        for (int i = 0; i < returnSong.Cvs1.length; i++) {
            if (returnSong.Cvs1[i]!=null) {
                returnSong.Cvs1[i] = returnSong.Cvs1[i].substring(0, returnSong.Cvs1[i].length() - 1); 
                returnSong.Cvs1[i] += "}"; 
            }
        }

        return returnSong; 
    }
    
    /**
     * Returns the MIDI file transcribed into an Array[indexOfBeat] = notesList<Integer>. 
     * @param fName
     * @param tempo
     * @return
     * @throws Exception 
     */
    public static ArrayList[] getNotesA(String fName, int tempo) throws Exception {
        ArrayList[] returnSong = new ArrayList[2000]; 
        
        Sequence sequence = MidiSystem.getSequence(new File(fName));

        // Below are calculations for basic MIDI file informations. 
        int milliSecondLength = (int) (sequence.getMicrosecondLength() / (1000.0)); 
        int bpm = (int) (sequence.getTickLength() / (milliSecondLength / 1000.0 / 60.0) / (sequence.getResolution() / tempo)); 
        
        int trackNumber = 0;
        for (Track track :  sequence.getTracks()) {
            trackNumber++;
            
            
            for (int i=0; i < track.size(); i++) { 
                MidiEvent event = track.get(i);
                // Each "Beat" should represent a frame in bitty.synth. 
                MidiMessage message = event.getMessage();
                if (message instanceof ShortMessage) {
                    ShortMessage sm = (ShortMessage) message;
                    if (sm.getCommand() == NOTE_ON) {
                        int key = sm.getData1();
                        int octave = (key / 12)-1;
                        int note = key % 12;
                        String noteName = NOTE_NAMES[note];
                        int velocity = sm.getData2();
                        
                        // Add note information 
                        try {
                            if (velocity>0) {
                                // If returnSong[beatIndex] == null, then create a new ArrayList<Integer> and push the note. 
                                // Else, push the note on the existing ArrayList<Integer>. 
                                int beatIndex = (int) (event.getTick() / (sequence.getResolution() / tempo)); 
                                if (returnSong[beatIndex]==null) returnSong[beatIndex] = new ArrayList<Integer>(); 
                                returnSong[beatIndex].add(new Integer(key)); 
                            }
                        }
                        catch (Exception e) {
                            
                        }
                    } 
                } else {
                }
            }
        }
        
        return returnSong; 
    }
    
    /**
     * Returns a string of the result of getNotesA for easier output. 
     * @param input
     * @return 
     */
    public static String getNotesAString(ArrayList[] input) {
        String returnString = ""; 
        
        for (int i = 0; i < input.length; i++) {
            if (input[i]!=null) {
                returnString += "At beat " + Integer.toString(i) + ": "; 
                for (int j = 0; j < input[i].size(); j++) {
                    returnString += Integer.toString((Integer) input[i].get(j)) + ","; 
                }
                returnString = returnString.substring(0, returnString.length() - 1); 
                returnString += "\n"; 
            }
        }
        
        return returnString; 
    }
    
    /**
     * Returns the MIDI file transcribed into an Array[indexOfTrack][indexOfBeat] = notesList<Integer>. 
     * @param fName
     * @param tempo
     * @return
     * @throws Exception 
     */
    public static ArrayList[][] getNotesMultiTrackA(String fName, int tempo) throws Exception {
        ArrayList[][] returnSong = new ArrayList[8][2000]; 
        
        Sequence sequence = MidiSystem.getSequence(new File(fName));

        // Below are calculations for basic MIDI file informations. 
        int milliSecondLength = (int) (sequence.getMicrosecondLength() / (1000.0)); 
        int bpm = (int) (sequence.getTickLength() / (milliSecondLength / 1000.0 / 60.0) / (sequence.getResolution() / tempo)); 
        
        int trackNumber = -1;
        for (Track track :  sequence.getTracks()) {
            trackNumber++;
            
            
            for (int i=0; i < track.size(); i++) { 
                MidiEvent event = track.get(i);
                // Each "Beat" should represent a frame in bitty.synth. 
                MidiMessage message = event.getMessage();
                if (message instanceof ShortMessage) {
                    ShortMessage sm = (ShortMessage) message;
                    if (sm.getCommand() == NOTE_ON) {
                        int key = sm.getData1();
                        int octave = (key / 12)-1;
                        int note = key % 12;
                        String noteName = NOTE_NAMES[note];
                        int velocity = sm.getData2();
                        
                        
                        
                        // Add note information 
                        try {
                            if (velocity>0) {
                                int beatIndex = (int) (event.getTick() / (sequence.getResolution() / tempo)); 
                                if (returnSong[trackNumber][beatIndex]==null) returnSong[trackNumber][beatIndex] = new ArrayList<Integer>(); 
                                returnSong[trackNumber][beatIndex].add(new Integer(key)); 
                            }
                        }
                        catch (Exception e) {
                            
                        }
                    } 
                } else {
                }
            }
        }
        return returnSong; 
    }
    
    /**
     * Returns a string of the result of getNotesMultiTrackA for easier output. 
     * @param input
     * @return The return string is in the following format: #TRACKNUMBER#: { (\n) [frameContents, frameContents]*...[frameContents]* (\n) } (\n) ...
     */
    public static String getNotesMultiTrackAString(ArrayList[][] input) {
        String returnString = ""; 
        int trackNumber = 0; 
        
        
        
        while(trackNumber < input.length && input[trackNumber] != null) {
            returnString += trackNumber +  ": {\n"; 
            for (int i = 0; i < input[trackNumber].length; i++) {
                if (input[trackNumber][i]!=null) {
                    //returnString += "["; 
                    for (int j = 0; j < input[trackNumber][i].size(); j++) {
                        returnString += Integer.toString((Integer) input[trackNumber][i].get(j)) + ","; 
                    }
                    returnString= returnString.substring(0, returnString.length() - 1); 
                    //returnString += "]*"; 
                    returnString += ";"; 
                } else {
                    //returnString += "[]*";
                    returnString += ";";
                }
            }
            trackNumber++; 
            returnString += "\n}\n"; 
        }
        return returnString; 
    }
    
    /**
     * Trims away empty frames on the left and right sides of a string produced by getNotesMultiTrackAString.
     * @param input
     * @return 
     */
    public static String trimGetNotesMultiTrackAString(String input) {
        String[] splitted = input.split("\n"); 
        
        splitted[1] = tTrim(splitted[1]); 
        splitted[4] = tTrim(splitted[4]);
        splitted[7] = tTrim(splitted[7]); 
        splitted[10] = tTrim(splitted[10]); 
        splitted[13] = tTrim(splitted[13]); 
        splitted[16] = tTrim(splitted[16]); 
        splitted[19] = tTrim(splitted[19]); 
        splitted[22] = tTrim(splitted[22]); 
        
        String resString = ""; 
        
        for (int i = 0; i < splitted.length; i ++)
            resString += splitted[i] + "\n"; 
        
        return resString; 
    }
    
    /**
     * Helper method. 
     * @param input
     * @return 
     */
    private static String lTrim(String input) {
        try {
            Matcher matcher = Pattern.compile("\\d").matcher(input);
            matcher.find(); 
            int index = Integer.valueOf(matcher.end()); 
            return input.substring(index - 1); 
        } catch (Exception ex) {
            // Not found, so trim away everything. 
            return ""; 
        }
    }
    
    /**
     * Helper method. 
     * @param input
     * @return 
     */
    private static String rTrim(String input) {
        String preprocess = new StringBuilder(input).reverse().toString(); 
        try {
            Matcher matcher = Pattern.compile("\\d").matcher(preprocess);
            matcher.find(); 
            int index = Integer.valueOf(matcher.end()); 
            return input.substring(0, input.length() - index + 1); 
        } catch (Exception ex) {
            // Not found, so trim away everything. 
            return ""; 
        }
    }
    
    /**
     * Helper method. 
     * @param input
     * @return 
     */
    public static String tTrim(String input) {
        return lTrim(rTrim(input)); 
    }

}
