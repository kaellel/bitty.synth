/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bitty_synth_midi_scanner;


import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author kenneth
 */
public class Bitty_synth_midi_scanner {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        /* 
        // The following code transcribes an MIDI file into a format readable by bitty.synth. 
        BittySongDefinition newBit = new BittySongDefinition();  
        try {
            // Tempo is usually 3, 4, 6, or 8. 
            newBit = MidiScanner.getNotes("/home/kenneth/Music/Impossible Piano - Frozen - Let It Go 250,000.mid", 4);
        } catch (Exception ex) {
            Logger.getLogger(Bitty_synth_midi_scanner.class.getName()).log(Level.SEVERE, null, ex);
        }
        String s = newBit.generateString();
        writeFile("/home/kenneth/Documents/Temporary Bins/Output.txt", s); 
        */
        
        /*
        // The following code transcribes an MIDI file into an ArrayList[2000] of ArrayList[i] = notesList<Integer> 
        // These definitions are used to make itty.bitty.ditty note libraries. 
        String s = ""; 
        try {
            // Tempo is usually 3, 4, 6, or 8. 
            s = MidiScanner.getNotesAString(MidiScanner.getNotesA("/home/kenneth/Music/Photograph_Piano_Version.mid", 4)); 
        } catch (Exception ex) {
            Logger.getLogger(Bitty_synth_midi_scanner.class.getName()).log(Level.SEVERE, null, ex);
        }
        writeFile("/home/kenneth/Documents/Temporary Bins/Output.txt", s); 
        */
        
        /*
        // The following code transcribes an MIDI file into an ArrayList[2000] of ArrayList[i] = notesList<Integer> 
        // These definitions are used to make itty.bitty.ditty note libraries. 
        // Then, a ConcurrentNoteLibrary is created for that individual song. 
        String s = ""; 
        try {
            // Tempo is usually 3, 4, 6, or 8. 
            s = ConcurrentNoteLibrary.getConcurrentNotesFromNoteAString(ConcurrentNoteLibrary.getConcurrentNotesFromNoteA(MidiScanner.getNotesA("/home/kenneth/Music/Photograph_Piano_Version.mid", 4))); 
        } catch (Exception ex) {
            Logger.getLogger(Bitty_synth_midi_scanner.class.getName()).log(Level.SEVERE, null, ex);
        }
        writeFile("/home/kenneth/Documents/Temporary Bins/Output.txt", s); 
        */ 
        
        /*
        // The following code concats two concurrentnotelibraries.  
        String s = ""; 
        try {
            ConcurrentNoteLibrary myLib = new ConcurrentNoteLibrary() ;
            myLib.addToLibrary("/home/kenneth/Music/Photograph_Piano_Version.mid", 4);
            myLib.addToLibrary("/home/kenneth/Music/Moonlight_first.mid", 6);
            s = ConcurrentNoteLibrary.getConcurrentNotesFromNoteAString(myLib.getLibrary()); 
            
        } catch (Exception ex) {
            Logger.getLogger(Bitty_synth_midi_scanner.class.getName()).log(Level.SEVERE, null, ex);
        }
        writeFile("/home/kenneth/Documents/Temporary Bins/Output.txt", s); 
        */
        
        /*
        // The following code concats two concurrentnotelibraries and gets a JS array. 
        String s = ""; 
        try {
            ConcurrentNoteLibrary myLib = new ConcurrentNoteLibrary() ;
            myLib.addToLibrary("/home/kenneth/Music/Photograph_Piano_Version.mid", 4);
            myLib.addToLibrary("/home/kenneth/Music/Moonlight_first.mid", 6);
            s = myLib.getJavaScriptString(); 
            
        } catch (Exception ex) {
            Logger.getLogger(Bitty_synth_midi_scanner.class.getName()).log(Level.SEVERE, null, ex);
        }
        writeFile("/home/kenneth/Documents/Temporary Bins/Output.txt", s); 
        */ 
        
        /*
        ArrayList<String> allFiles = ListFilesUtil.listFilesAndFilesSubDirectories("C:\\Users\\k_nn_\\Desktop\\MIDI Library\\Big Midi Lump");
        System.out.println(allFiles.size());
        ConcurrentNoteLibrary myLib = new ConcurrentNoteLibrary();
        for (String fName : allFiles) {
            if (fName.toUpperCase().endsWith(".MID")) {
                myLib.addToLibrary(fName, 4);
            }
        }
        String s = myLib.getJavaScriptString(); 
        writeFile("C:\\Users\\k_nn_\\Desktop\\MIDI Library\\concurrentMiscLibrary.txt", s); 
        */
        
        String s = ""; 
        try {
            s = PatternLibrary.getPatternFromSongAJS(PatternLibrary.getPatternFromSongA(MidiScanner.getNotesMultiTrackA("C:\\Users\\k_nn_\\Desktop\\MIDI Library\\Pop and Electronic\\Ne-Yo ft. Pitbull - Give me everything (Afrojack).mid", 12))); 
        } catch (Exception ex) {
            Logger.getLogger(Bitty_synth_midi_scanner.class.getName()).log(Level.SEVERE, null, ex);
        }
        writeFile("C:\\Users\\k_nn_\\Desktop\\MIDI Library\\Output.txt", s); 
        
        
        
    }
    
    public static void writeFile(String fName, String fContents) {
        File file = new File(fName);
        String content = fContents;

        try (FileOutputStream fop = new FileOutputStream(file)) {
            // if file doesn't exists, then create it
            if (!file.exists()) {
                    file.createNewFile();
            }
            // get the content in bytes
            byte[] contentInBytes = content.getBytes();

            fop.write(contentInBytes);
            fop.flush();
            fop.close();

            System.out.println("Done");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
}
