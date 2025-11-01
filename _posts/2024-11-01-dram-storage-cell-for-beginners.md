<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>DRAM Principle 1: DRAM Storage Cell</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        h1 {
            color: #2c3e50;
            font-size: 1.8em;
            margin-bottom: 10px;
        }
        .meta {
            color: #7f8c8d;
            font-size: 0.95em;
            margin-bottom: 20px;
        }
        h2 {
            color: #1a5276;
            margin-top: 25px;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        h3 {
            color: #2874a6;
            margin-top: 20px;
            margin-bottom: 12px;
            font-size: 1.2em;
        }
        h4 {
            color: #2980b9;
            margin-top: 18px;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        p, ul, ol {
            margin-bottom: 14px;
        }
        ul, ol {
            padding-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .equation {
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 8px 12px;
            border-left: 3px solid #3498db;
            margin: 12px 0;
            font-size: 1.05em;
        }
        .note {
            background: #fff8e1;
            padding: 12px;
            border-left: 3px solid #ffc107;
            margin: 18px 0;
            font-style: italic;
        }
        .footer-note {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            color: #7f8c8d;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>DRAM Principle 1: DRAM Storage Cell</h1>
        <div class="meta">Author: codingbelief &nbsp;|&nbsp; Category: Basic Technologies</div>

        <h2>1. Storage Capacitor</h2>
        <p>DRAM Storage Cell uses Storage Capacitor to store bit information.</p>

        <p>It consists of the following 4 parts:</p>
        <ul>
            <li>A storage capacitor represents a logical 1 or 0 by the amount of charge stored in it, or by the voltage difference across its terminals.</li>
            <li>The access transistor, when turned on or off, determines whether reading or modifying the information stored in the storage capacitor is allowed or prohibited.</li>
            <li>The wordline determines whether the Access Transistor is open or closed.</li>
            <li>The bitline is the only channel for external access to the Storage Capacitor. When the Access Transistor is activated, external access can read or write to the Storage Capacitor through the bitline.</li>
        </ul>

        <p>The Common terminal of the Storage Capacitor is connected to Vcc/2.</p>
        <p>When the Storage Capacitor stores 1 information, the voltage at the other terminal is Vcc, and the stored charge is...</p>
        <div class="equation">Q = +Vcc/2 × C</div>
        <p>When the information stored in the Storage Capacitor is 0, the voltage at the other end is 0, and the stored charge at this time...</p>
        <div class="equation">Q = -Vcc/2 × C</div>

        <h3>1.1 Data Reading and Writing Principles</h3>
        <p>From the above structural diagram, we can easily deduce the data read/write process of the DRAM Storage Cell:</p>
        <ul>
            <li>When reading data, set the Wordline to logic high, enable the Access Transistor, and then read the state on the Bitline.</li>
            <li>When writing data, first set the level state to be written to the Bitline, then open the Access Transistor and change the internal state of the Storage Capacitor through the Bitline.</li>
        </ul>

        <p>However, in practice, if the DRAM Storage Cell is read and written according to the above process, the following problems will be encountered:</p>

        <ol>
            <li><strong>The logic levels of the external circuitry are mismatched with those of the storage capacitor.</strong><br>
            Because the bitline capacitance is much larger than that of the storage capacitor (typically more than 10 times), when the access transistor is turned on, the bitline voltage changes very little if the information stored in the storage capacitor is 1. External circuits cannot directly read the information stored in the storage capacitor through the bitline.</li>

            <li><strong>After a read operation, the charge stored in the Storage Capacitor changes.</strong><br>
            During a read operation, when the Access Transistor is turned on, the voltage difference between the Bitline and the Storage Capacitor terminals causes the amount of charge stored in the Storage Capacitor to change. This may ultimately lead to an inability to correctly determine the information stored in the Storage Capacitor during subsequent read operations.</li>

            <li><strong>Due to the physical characteristics of the Capacitor, the stored charge will gradually decrease even without read/write operations.</strong><br>
            This characteristic requires DRAM to actively perform charge recovery operations on the Storage Capacitor when there are no read/write operations.</li>
        </ol>

        <p>To address the aforementioned issues, DRAM incorporates the Differential Sense Amplifier in its design.</p>

        <h2>2. Differential Sense Amplifier</h2>
        <p>The Differential Sense Amplifier consists of two main parts: a Sensing Circuit and a Voltage Equalization Circuit. Its primary function is to convert the information stored in the Storage Capacitor into the voltage corresponding to logic 1 or 0 and display it on the Bitline. Simultaneously, after a read operation, the Bitline restores the charge in the Storage Capacitor to its state before the read operation.</p>

        <p>In the following sections, we will examine the complete data reading and writing process to understand how the Differential Sense Amplifier works.</p>

        <h3>2.1 Read Operation</h3>
        <p>A complete Read Operation consists of four stages: Precharge, Access, Sense, and Restore. The following sections will describe the complete process of reading Bit 1 from the Storage Capacitor.</p>

        <h4>2.1.1 Precharge</h4>
        <p>In this stage, the EQ signal is first used to turn on transistors Te1, Te2, and Te3, stabilizing the voltage on the Bitline and /Bitline lines at Vref, where Vref = Vcc/2. Then, the process proceeds to the next stage.</p>

        <h4>2.1.2 Access</h4>
        <p>After the Precharge phase, the voltage on the Bitline and /Bitline lines has stabilized at Vref. At this point, the Ta transistor is turned on by controlling the Wordline signal. The positive charge stored in the Storage Capacitor flows to the Bitline, thereby pulling the Bitline voltage up to Vref+. Then, the process proceeds to the next phase.</p>

        <h4>2.1.3 Sense</h4>
        <p>During the Access phase, the Bitline voltage is pulled up to Vref+, making Tn2 more conductive than Tn1, and Tp1 more conductive than Tp2.<br>
        At this time, the SAN (Sense-Amplifier N-Fet Control) is set to logic 0, and the SAP (Sense-Amplifier P-Fet Control) is set to logic 1, i.e., Vcc. Because Tn2 is more conductive than Tn1, the voltage on /Bitline is pulled up to logic 0 by the SAN more quickly, and similarly, the voltage on Bitline is pulled up to logic 1 by the SAP more quickly. Then, Tp1 and Tn2 enter the conducting state, while Tp2 and Tn1 enter the cutoff state.<br>
        Finally, the voltages of both Bitline and /Bitline reach a stable state, correctly representing the information bits stored by the Storage Capacitor.</p>

        <h4>2.1.4 Restore</h4>
        <p>After completing the Sense phase, the Bitline is at a stable logic 1 voltage Vcc, at which point the Bitline charges the Storage Capacitor. After a specific period of time, the Storage Capacitor's charge is restored to its state before the read operation.</p>

        <p>Finally, by using the CSL signal, Tc1 and Tc2 are put into the conducting state, and the outside world can read the specific information from the Bitline.</p>

        <h4>2.1.5 Timing</h4>
        <p>The timing diagram of the entire Read Operation shows that Vcc is the voltage corresponding to logic 1 and Gnd is logic 0.</p>

        <h2>3. Write Operation</h2>
        <p>The initial process of a Write Operation is the same as that of a Read Operation, involving Precharge, Access, Sense, and Restore operations. The difference lies in the fact that a Write Recovery operation is performed after the Restore phase.</p>

        <h3>3.1 Write Recovery</h3>
        <p>During the Write Recovery phase, the Write Enable (WE) signal is controlled to put Tw1 and Tw2 into the conducting state. At this time, Bitline is pulled to logic 0 by input, and /Bitline is pulled to logic 1 by /input.<br>
        After a specific period of time, when the Storage Capacitor's charge is discharged to 0, the Access Transistor of the Storage Capacitor can be turned off by controlling Wordline, and the write operation to 0 is completed.</p>

        <h2>4. References</h2>
        <p>Memory Systems - Cache Dram and Disk</p>

        <div class="footer-note">
            Original article, KumarNeupane<br>
            Tags: SDRAM dram
        </div>
    </div>
</body>
</html>

