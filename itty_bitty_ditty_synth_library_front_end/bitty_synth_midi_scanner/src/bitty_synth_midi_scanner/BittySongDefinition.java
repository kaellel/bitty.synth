/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bitty_synth_midi_scanner;

/**
 *
 * @author kenneth
 */
public class BittySongDefinition {

    // Canvas definition. 
    public int Cvs1BPM = 130;
    public int Cvs2BPM = 130;
    public int Cvs3BPM = 130;
    public int Cvs4BPM = 130;
    public int Cvs5BPM = 130;
    public String Cvs1Instrument = "acoustic_grand_piano";
    public String Cvs2Instrument = "acoustic_grand_piano";
    public String Cvs3Instrument = "acoustic_grand_piano";
    public String Cvs4Instrument = "acoustic_grand_piano";
    public String Cvs5Instrument = "acoustic_grand_piano";
    public String[] Cvs1 = new String[20000];
    public String[] Cvs2 = new String[20000];
    public String[] Cvs3 = new String[20000];
    public String[] Cvs4 = new String[20000];
    public String[] Cvs5 = new String[20000];

    // External definition. 
    public String Ext1;
    public String Ext2;
    public String Ext3;

    // Timeline definition. 
    // Note: The timeline of a song scanned from an MIDI file is just all canvas
    // es played at 0, and all Exts set to null. 
    public String TmlCvs1 = "0,";
    public String TmlCvs2 = "0,";
    public String TmlCvs3 = "0,";
    public String TmlCvs4 = "0,";
    public String TmlCvs5 = "0,";
    public String ExtCvs1 = null;
    public String ExtCvs2 = null;
    public String ExtCvs3 = null;

    /**
     * Generates a SongString that can be imported to Bitty.Synth. String format
     * is as follows:
     * tml1Contents,tml1Contents...tml1Contents;tml2Contents...;...;tmlEXT3Contents;^<canvas1contents>^...^<canvas5contents>^<canvasdefinitions>^"ext1"^"ext2"^"ext3"^
     * <canvasNcontents> in the form of
     * <framenumber>-{framecontents};<framenumber>-{framecontents};
     * <canvasdefinitions> in the form of bpm1;ins1;bpm2;ins2;...;bpm5;ins5;
     *
     * @return
     */
    public String generateString() {
        String retString = "";
        retString += TmlCvs1 + ";";
        retString += TmlCvs2 + ";";
        retString += TmlCvs3 + ";";
        retString += TmlCvs4 + ";";
        retString += TmlCvs5 + ";";
        retString += "null;";
        retString += "null;";
        retString += "null;";
        retString += "^";

        for (int i = 0; i < Cvs1.length; i++) {
            if (Cvs1[i] != null) {
                retString += (new Integer(i)).toString() + "-" + Cvs1[i] + ";";
            }
        }
        retString += "^";

        for (int i = 0; i < Cvs2.length; i++) {
            if (Cvs2[i] != null) {
                retString += (new Integer(i)).toString() + "-" + Cvs2[i] + ";";
            }
        }
        retString += "^";

        for (int i = 0; i < Cvs3.length; i++) {
            if (Cvs3[i] != null) {
                retString += (new Integer(i)).toString() + "-" + Cvs3[i] + ";";
            }
        }
        retString += "^";

        for (int i = 0; i < Cvs4.length; i++) {
            if (Cvs4[i] != null) {
                retString += (new Integer(i)).toString() + "-" + Cvs4[i] + ";";
            }
        }
        retString += "^";

        for (int i = 0; i < Cvs5.length; i++) {
            if (Cvs5[i] != null) {
                retString += (new Integer(i)).toString() + "-" + Cvs5[i] + ";";
            }
        }
        retString += "^";

        // Canvasdefinition: bpm1;ins1;bpm2;ins2;...;bpm5;ins5;
        retString += Cvs1BPM + ";";
        retString += Cvs1Instrument + ";";
        retString += Cvs2BPM + ";";
        retString += Cvs2Instrument + ";";
        retString += Cvs3BPM + ";";
        retString += Cvs3Instrument + ";";
        retString += Cvs4BPM + ";";
        retString += Cvs4Instrument + ";";
        retString += Cvs5BPM + ";";
        retString += Cvs5Instrument + ";";
        retString += "^";

        retString += "\"" + Ext1 + "\"^";
        retString += "\"" + Ext2 + "\"^";
        retString += "\"" + Ext3 + "\"^";

        return retString;
    }
}
