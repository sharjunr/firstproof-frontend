import { developRole } from "./role-content";
import { expandedCatalog } from "./catalog";
import type { Store, Opportunity, Application, Eligibility } from "./types";
export const emptyEligibility: Eligibility = {
  academic: false,
  authorization: false,
  availability: false,
  qualifications: false,
  acknowledgment: false,
};
export const student = {
  id: "alex",
  name: "Alex Morgan",
  email: "alex@example.test",
  role: "student" as const,
  university: "",
  program: "",
  resume: "",
};
export const employer = {
  id: "employer-demo",
  name: "Jamie Chen",
  email: "jamie@example.test",
  role: "employer" as const,
  university: "",
  program: "Hiring team · Northstar Labs (fictional)",
  resume: "",
};
const flagshipOpportunities: Omit<
  Opportunity,
  "deadline" | "reviewDays" | "status" | "owner" | "demo" | "challengeDays"
>[] = [
  {
    id: "ai-developer",
    title: "Digital Design Engineering Intern",
    company: "AMD",
    industry: "Engineering",
    majors: ["Electrical Engineering", "Computer Engineering"],
    tags: [
      "amd",
      "rtl",
      "verilog",
      "systemverilog",
      "fpga",
      "digital",
      "fifo",
      "hardware",
      "simulation",
      "verification",
    ],
    location: "Markham, ON",
    arrangement: "Hybrid",
    type: "Internship",
    paid: true,
    pay: 30,
    duration: 4,
    effort: 4,
    description:
      "Fictional Demo — Not affiliated with AMD. Join the fictional AMD Silicon Design & Verification demo team to work on synthesizable RTL blocks, simulation testbenches, and digital subsystem verification.",
    responsibilities:
      "Design synthesizable RTL blocks in Verilog/SystemVerilog, write self-checking simulation testbenches, debug waveform timing and boundary conditions, and document module interfaces for subsystem integration.",
    dayInTheRole:
      "Digital design engineers develop and verify RTL modules used in larger hardware systems—writing synthesizable SystemVerilog, building self-checking testbenches, inspecting waveforms, and closing boundary-condition coverage before synthesis. The synchronous FIFO challenge demonstrates a small, representative part of that daily workflow.",
    qualifications:
      "Coursework or project experience in digital logic, computer architecture, and Verilog or SystemVerilog simulation.",
    challenge: "Design and Verify a Synchronous FIFO",
    scenario:
      "Your team is developing a digital data-processing subsystem. You need a FIFO buffer that temporarily stores incoming 8-bit data words before a downstream processing module reads them. Your task is to design and verify this component.",
    specifications: [
      "8-bit data width (DATA_WIDTH = 8), 16-entry depth (DEPTH = 16)",
      "Single-clock synchronous operation (clk)",
      "Active-high synchronous reset (rst)",
      "Read enable (rd_en) and write enable (wr_en) inputs",
      "Full (full) and empty (empty) status outputs",
      "Defined, deterministic behavior for simultaneous reads and writes and overflow/underflow protection",
    ],
    skills: [
      "RTL Design",
      "Verilog / SystemVerilog",
      "Digital Logic",
      "Verification",
      "Simulation & Waveforms",
    ],
    starterMaterials: [
      {
        name: "fifo_interface_spec.sv",
        description:
          "Required module interface, parameters, and port declarations for fifo.sv.",
        content: `// Fictional Demo — Not affiliated with AMD
// Module specification: 8-bit, 16-entry Synchronous FIFO
module sync_fifo #(
  parameter int DATA_WIDTH = 8,
  parameter int DEPTH      = 16
) (
  input  logic                  clk,
  input  logic                  rst,     // Active-high synchronous reset
  input  logic                  wr_en,
  input  logic                  rd_en,
  input  logic [DATA_WIDTH-1:0] din,
  output logic [DATA_WIDTH-1:0] dout,
  output logic                  full,
  output logic                  empty
);
  // TODO: Implement pointer management, memory array, full/empty logic,
  // and simultaneous read/write handling.
endmodule
`,
      },
      {
        name: "fifo_tb_skeleton.sv",
        description:
          "Starter SystemVerilog testbench harness with clock generation and test sequence stubs.",
        content: `// Fictional Demo — Not affiliated with AMD
\`timescale 1ns/1ps
module fifo_tb;
  logic clk = 0;
  logic rst = 1;
  logic wr_en = 0, rd_en = 0;
  logic [7:0] din = 8'h00;
  logic [7:0] dout;
  logic full, empty;

  always #5 clk = ~clk;

  sync_fifo #(.DATA_WIDTH(8), .DEPTH(16)) dut (
    .clk(clk), .rst(rst), .wr_en(wr_en), .rd_en(rd_en),
    .din(din), .dout(dout), .full(full), .empty(empty)
  );

  initial begin
    $dumpfile("fifo_waves.vcd");
    $dumpvars(0, fifo_tb);
    // 1. Verify synchronous reset sets empty=1, full=0
    // 2. Fill 16 entries and verify full=1
    // 3. Test simultaneous wr_en & rd_en wrap-around
    // 4. Drain all 16 entries and verify data ordering & empty=1
    #200 $finish;
  end
endmodule
`,
      },
      {
        name: "verification_checklist.md",
        description:
          "Corner cases and boundary conditions expected in your testbench and README.",
        content: `# Synchronous FIFO Verification Checklist (Fictional Demo)
1. Reset state: empty == 1, full == 0 immediately after synchronous reset.
2. Single write/read ordering: FIFO preserves first-in, first-out ordering across pointer wrap-around.
3. Full boundary: asserting wr_en when full == 1 does not corrupt stored entries or pointers.
4. Empty boundary: asserting rd_en when empty == 1 does not underflow occupancy count.
5. Simultaneous read & write: specify and verify behavior when wr_en && rd_en are asserted on the same clock edge.`,
      },
    ],
    acceptanceCriteria: [
      "Synthesizable RTL module matches 8-bit width, 16-entry depth, and synchronous reset specification",
      "Full and empty flags transition accurately without combinational glitches",
      "Self-checking testbench verifies normal operation, pointer wrap-around, and boundary conditions",
      "README clearly documents architecture and simultaneous read/write behavior",
    ],
    instructions:
      "Design and verify a configurable 8-bit, 16-entry synchronous FIFO buffer in Verilog or SystemVerilog. Implement read/write control, full/empty flags, deterministic simultaneous read/write behavior, and a simulation testbench that verifies normal operation and edge cases.",
    deliverables: [
      "fifo.sv — RTL implementation",
      "fifo_tb.sv — Simulation testbench",
      "Simulation waveform screenshot",
      "README.md — Architecture, assumptions, and verification results",
    ],
    tools:
      "Verilog or SystemVerilog with any standard simulator (Icarus Verilog, Verilator, ModelSim, or Vivado Simulator). Disclose any AI assistance.",
    criteria:
      "Published employer review criteria (human review only, not automated AI scores): Correctness of FIFO behavior, reset and boundary-condition handling, testbench coverage and clarity, and quality of design documentation.",
    eligibility:
      "Currently enrolled engineering student or recent graduate; self-declared work authorization and availability for the stated internship term.",
    rubric: [
      {
        id: "fifo-correctness",
        label: "Correctness of FIFO behavior",
        weight: 35,
        description:
          "Accurate FIFO ordering, pointer wrap-around, and full/empty flag logic.",
      },
      {
        id: "boundary-handling",
        label: "Reset and boundary-condition handling",
        weight: 25,
        description:
          "Clean synchronous reset, overflow/underflow protection, and simultaneous R/W handling.",
      },
      {
        id: "testbench-coverage",
        label: "Testbench coverage and clarity",
        weight: 25,
        description:
          "Self-checking assertions, edge-case stimulus, and readable waveform evidence.",
      },
      {
        id: "documentation",
        label: "Quality of design documentation",
        weight: 15,
        description:
          "Clear README explaining architecture, timing assumptions, and verification results.",
      },
    ],
  },
  {
    id: "frontend-developer",
    title: "RF Test Engineering Intern",
    company: "Skyworks Solutions",
    industry: "Engineering",
    majors: [
      "Electrical Engineering",
      "Computer Engineering",
      "Engineering Physics",
    ],
    tags: [
      "skyworks",
      "rf",
      "s-parameters",
      "amplifier",
      "return loss",
      "python",
      "test automation",
    ],
    location: "Ottawa",
    arrangement: "Onsite",
    type: "Internship",
    paid: true,
    pay: 28,
    duration: 4,
    effort: 3,
    description:
      "Fictional Demo — Not affiliated with Skyworks Solutions. Join the fictional RF Characterization & Test Engineering team to automate S-parameter analysis, evaluate amplifier prototypes against datasheet limits, and produce lab validation reports.",
    responsibilities:
      "Automate RF measurement post-processing in Python, analyze 2-port S-parameters (S11, S21, S22), generate gain and return-loss plots, and flag specification failures for circuit designers.",
    dayInTheRole:
      "RF test engineers automate measurements, interpret S-parameters from vector network analyzers, and identify devices that fail electrical specifications before release. This challenge mirrors the exact post-measurement analysis performed in an RF characterization lab.",
    qualifications:
      "Foundational knowledge of RF circuits, impedance matching, S-parameters, and Python data analysis.",
    challenge: "Analyze Simulated RF Amplifier Test Measurements",
    scenario:
      "You receive simulated 2-port S-parameter data (1.8–2.8 GHz) for a 2.4 GHz low-noise RF amplifier stage. You must identify input/output return-loss problems, plot small-signal gain versus frequency, and determine whether the device meets its electrical specifications.",
    specifications: [
      "Operating passband: 2.10 GHz to 2.50 GHz",
      "Minimum forward gain (|S21|): >= 14.5 dB across 2.10–2.50 GHz",
      "Passband gain flatness: within ±0.75 dB across 2.10–2.50 GHz",
      "Input return loss (|S11|) and output return loss (|S22|): <= -10.0 dB across 2.10–2.50 GHz",
      "Pinpoint any frequency ranges where return loss or gain violates the specification",
    ],
    skills: [
      "RF Fundamentals",
      "S-Parameters",
      "Python",
      "Test Automation",
      "Engineering Plotting",
    ],
    starterMaterials: [
      {
        name: "lna_synthetic_sparameters.csv",
        description:
          "Synthetic 2-port S-parameter sweep from 1.80 GHz to 2.80 GHz (Freq_GHz, S11_dB, S21_dB, S12_dB, S22_dB).",
        content: `Freq_GHz,S11_dB,S21_dB,S12_dB,S22_dB
1.80,-6.2,12.1,-28.4,-8.1
1.90,-8.4,13.6,-27.9,-9.5
2.00,-10.8,14.7,-27.2,-11.2
2.10,-13.5,15.4,-26.8,-13.1
2.20,-15.2,15.6,-26.5,-14.4
2.30,-12.8,15.3,-26.4,-13.8
2.40,-9.6,14.8,-26.2,-12.1
2.45,-8.1,14.3,-26.0,-11.0
2.50,-7.4,13.9,-25.9,-10.4
2.60,-5.9,12.6,-25.5,-8.9
2.70,-4.5,10.8,-25.1,-7.2
2.80,-3.8,9.1,-24.8,-6.0
`,
      },
      {
        name: "rf_amplifier_spec_limits.json",
        description:
          "Target electrical specification limits for automated pass/fail checking.",
        content: JSON.stringify(
          {
            part: "SKY-DEMO-LNA24 (Fictional)",
            passband_ghz: [2.1, 2.5],
            min_s21_db: 14.5,
            max_gain_variation_db: 1.5,
            max_s11_db: -10.0,
            max_s22_db: -10.0,
          },
          null,
          2,
        ),
      },
    ],
    acceptanceCriteria: [
      "Correctly parses the synthetic S-parameter table and evaluates passband limits (2.10–2.50 GHz)",
      "Identifies the upper-passband S11 return-loss violation (>= -10 dB at 2.40–2.50 GHz) and S21 roll-off at 2.45–2.50 GHz",
      "Generates clearly labeled frequency-response plots with specification threshold lines",
      "Provides a concise engineering conclusion and matching-network recommendation",
    ],
    instructions:
      "Analyze the provided synthetic S-parameter measurements from an RF amplifier stage. Calculate passband gain, gain flatness, and input/output return loss, identify where the device fails specifications, and produce annotated plots and a concise report.",
    deliverables: [
      "Python analysis script (rf_analysis.py)",
      "Gain and return-loss plots vs. frequency with spec limit lines",
      "Concise engineering report detailing pass/fail findings",
    ],
    tools:
      "Python (NumPy, Pandas, Matplotlib, or scikit-rf). Disclose any AI assistance and explain your interpretation of the RF measurements.",
    criteria:
      "Published employer review criteria (human review only): accuracy of S-parameter calculations, identification of return-loss and gain failures, plot clarity, and engineering reasoning.",
    eligibility:
      "Currently enrolled engineering student or recent graduate; self-declared work authorization and availability.",
    rubric: [
      {
        id: "rf-calculations",
        label: "S-parameter & pass/fail accuracy",
        weight: 35,
        description:
          "Correct evaluation of |S21|, |S11|, |S22|, and gain flatness across 2.1–2.5 GHz.",
      },
      {
        id: "failure-identification",
        label: "Return-loss & spec-violation identification",
        weight: 25,
        description:
          "Pinpoints the 2.40–2.50 GHz input return-loss mismatch and gain droop.",
      },
      {
        id: "rf-plots",
        label: "Plot quality & spec annotations",
        weight: 20,
        description:
          "Readable dB vs. GHz plots with clearly marked passband and limit lines.",
      },
      {
        id: "rf-report",
        label: "Engineering report & recommendations",
        weight: 20,
        description:
          "Clear diagnostic summary and practical high-side impedance matching suggestion.",
      },
    ],
  },
  {
    id: "business-analyst",
    title: "Embedded Software Intern",
    company: "Orbital Link Satellite Communications",
    industry: "Software & AI",
    majors: [
      "Computer Engineering",
      "Software Engineering",
      "Electrical Engineering",
      "Computer Science",
    ],
    tags: [
      "satellite",
      "embedded",
      "telemetry",
      "firmware",
      "c++",
      "python",
      "crc",
      "packet decoder",
    ],
    location: "Toronto",
    arrangement: "Hybrid",
    type: "Internship",
    paid: true,
    pay: 29,
    duration: 4,
    effort: 3.5,
    description:
      "Fictional Demo — Not affiliated with this company. Join our fictional satellite flight & ground software team to build resilient telemetry decoders, packet validators, and spacecraft health monitoring tools.",
    responsibilities:
      "Write C++ or Python packet parsers for satellite subsystem telemetry, verify framing sync words and CRC-16 checksums, and build automated tests for anomalous or corrupted downlink frames.",
    dayInTheRole:
      "Embedded and ground-station software engineers translate binary interface control documents (ICDs) into deterministic packet decoders, validate checksums over noisy radio links, and flag out-of-family thermal or power readings.",
    qualifications:
      "Proficiency in Python or C++, binary data manipulation, bitwise operations, and unit testing.",
    challenge: "Build a Satellite Telemetry Packet Decoder",
    scenario:
      "The company provides simulated satellite telemetry packets from a LEO attitude-and-power subsystem. You must write software to decode temperature, battery voltage, and orientation data, validate CRC-16 checksums, and flag abnormal readings.",
    specifications: [
      "12-byte binary frame format (hex-encoded per line) starting with 2-byte sync word 0xEB90",
      "Byte layout: [0..1] sync 0xEB90, [2] seq_id (uint8), [3..4] battery_mv (uint16 BE), [5..6] temp_deci_c (int16 BE), [7..8] pitch_deg10 (int16 BE), [9] status_flags (uint8), [10..11] crc16_xor (uint16 BE)",
      "Checksum rule: 16-bit big-endian sum of bytes [0..9] modulo 65536 must match bytes [10..11]",
      "Flag abnormal readings: battery_mv < 6800 mV, temp_c > 60.0 °C or < -15.0 °C, or |pitch_deg| > 45.0°",
      "Reject malformed frames or bad sync/checksums without halting the stream parser",
    ],
    skills: [
      "Embedded Programming",
      "Packet Parsing",
      "Data Validation & Checksums",
      "Python or C++",
      "Unit Testing",
    ],
    starterMaterials: [
      {
        name: "telemetry_packets_synthetic.hex",
        description:
          "Synthetic satellite downlink hex frames including nominal frames, a bad checksum frame, a low-battery warning, and an over-temperature fault.",
        content: `# Fictional Satellite Telemetry Stream (12 bytes / 24 hex chars per frame)
EB90011D4C00FA00140103DF
EB90021D1A0104001E0103C9
EB9003196401180028030037
EB90041CE8028A000A0503BA
EB90051D00010E001001FFFF
EB90061CF40104021C0903E3
`,
      },
      {
        name: "telemetry_icd_spec.md",
        description:
          "Interface Control Document (ICD) specifying byte offsets, endianness, scaling factors, and fault thresholds.",
        content: `# Fictional LEO Subsystem Telemetry ICD
- Bytes 0–1: Sync word = 0xEB90
- Byte 2: Sequence counter (uint8)
- Bytes 3–4: Battery voltage in mV (uint16 big-endian, nominal 7000–8400 mV, fault < 6800 mV)
- Bytes 5–6: Board temperature in 0.1 °C (int16 big-endian, fault > 60.0 °C or < -15.0 °C)
- Bytes 7–8: Pitch angle in 0.1 deg (int16 big-endian, fault if |pitch| > 45.0 deg)
- Byte 9: Subsystem bitmask (bit 0 = payload_on, bit 1 = heater_on, bit 2 = fault_latched)
- Bytes 10–11: 16-bit big-endian sum of bytes[0..9] & 0xFFFF`,
      },
    ],
    acceptanceCriteria: [
      "Decodes all valid frames into human-readable engineering units (V, °C, degrees)",
      "Detects and logs frame #5 as a checksum mismatch without crashing",
      "Flags frame #3 (battery < 6.8 V), frame #4 (temp > 60 °C), and frame #6 (pitch > 45°)",
      "Includes unit tests covering valid, corrupted, and truncated packet inputs",
    ],
    instructions:
      "Implement a telemetry packet decoder in Python or C++ for a simulated satellite subsystem. Parse binary/hex sensor fields, validate frame sync and checksums, and flag abnormal readings according to the ICD.",
    deliverables: [
      "Python or C++ telemetry decoder source code",
      "Automated unit tests and sample decoded output log",
      "Short test report documenting decoded values, checksum rejections, and anomaly flags",
    ],
    tools:
      "Python 3 or C++17/20 using standard libraries. Disclose any AI assistance and document your packet validation logic.",
    criteria:
      "Published employer review criteria (human review only): accuracy of binary field decoding, checksum and error handling, anomaly threshold detection, and test coverage.",
    eligibility:
      "Currently enrolled student or recent graduate in computer, software, or electrical engineering; self-declared work authorization.",
    rubric: [
      {
        id: "packet-decoding",
        label: "Packet parsing & field scaling",
        weight: 35,
        description:
          "Accurate big-endian extraction and conversion to physical units.",
      },
      {
        id: "checksum-validation",
        label: "Checksum & malformed frame handling",
        weight: 25,
        description:
          "Reliably rejects bad sync words, truncated lines, and invalid checksums.",
      },
      {
        id: "anomaly-detection",
        label: "Abnormal reading detection & unit tests",
        weight: 25,
        description:
          "Flags battery, thermal, and attitude threshold violations with automated tests.",
      },
      {
        id: "code-clarity",
        label: "Code structure & test report",
        weight: 15,
        description:
          "Clean, maintainable parser interface and clear summary of decoded frames.",
      },
    ],
  },
  {
    id: "electrical-engineer",
    title: "Software Engineering Intern",
    company: "NVIDIA",
    industry: "Software & AI",
    majors: [
      "Computer Science",
      "Computer Engineering",
      "Software Engineering",
      "Mathematics",
    ],
    tags: [
      "nvidia",
      "ai",
      "gpu",
      "matrix multiplication",
      "vectorization",
      "performance",
      "python",
      "cuda",
    ],
    location: "Toronto",
    arrangement: "Hybrid",
    type: "Internship",
    paid: true,
    pay: 32,
    duration: 4,
    effort: 4,
    description:
      "Fictional Demo — Not affiliated with NVIDIA. Join our fictional Compute Performance Engineering team to profile numerical kernels, optimize matrix operations using vectorization or GPU acceleration, and validate floating-point accuracy.",
    responsibilities:
      "Optimize numerical linear-algebra routines, build reproducible latency and throughput benchmarks, and verify floating-point numerical correctness against reference implementations.",
    dayInTheRole:
      "Compute software engineers profile hot loops in AI and scientific workloads, apply cache tiling, SIMD vectorization, or GPU kernels, and verify that speedups preserve numerical accuracy across matrix dimensions.",
    qualifications:
      "Strong programming skills in Python or C++, linear algebra fundamentals, and familiarity with vectorization, memory hierarchy, or GPU compute.",
    challenge: "Optimize a Matrix Multiplication Implementation",
    scenario:
      "You receive a baseline Python matrix multiplication implementation that is bottlenecking a preprocessing pipeline. Your task is to improve performance using cache blocking, NumPy/BLAS vectorization, Numba, or GPU acceleration, benchmark the speedup, and verify numerical correctness.",
    specifications: [
      "Support FP32 matrices across sizes N = 64, 128, 256, and 512",
      "Verify numerical correctness: max absolute error <= 1e-4 compared to the reference implementation",
      "Measure warmup + timed runs reporting mean execution time (ms) and effective GFLOP/s",
      "Explain why your optimization improves memory locality or compute throughput",
    ],
    skills: [
      "Performance Optimization",
      "Vectorization / GPU Acceleration",
      "Python / C++ / NumPy",
      "Benchmarking",
      "Numerical Verification",
    ],
    starterMaterials: [
      {
        name: "baseline_matmul.py",
        description:
          "Baseline triple-loop matrix multiplication script with correctness check and timing harness.",
        content: `# Fictional Demo — Not affiliated with NVIDIA
import time
import random

def matmul_baseline(A, B):
    m, k = len(A), len(A[0])
    n = len(B[0])
    C = [[0.0] * n for _ in range(m)]
    for i in range(m):
        for p in range(k):
            a_ip = A[i][p]
            for j in range(n):
                C[i][j] += a_ip * B[p][j]
    return C

# TODO: Implement an optimized version (e.g., tiled/vectorized/GPU-accelerated),
# verify max_abs_error <= 1e-4, and benchmark latency & GFLOP/s across N=64, 128, 256, 512.
`,
      },
    ],
    acceptanceCriteria: [
      "Passes numerical verification (max_abs_error <= 1e-4) on square and rectangular test matrices",
      "Includes reproducible benchmark table comparing baseline vs. optimized latency and GFLOP/s",
      "Explains memory-hierarchy, vectorization, or parallelization trade-offs clearly",
    ],
    instructions:
      "Take the provided baseline Python matrix multiplication implementation and improve its performance using vectorization, cache tiling, or GPU acceleration. Benchmark latency and throughput across multiple matrix sizes and verify numerical correctness.",
    deliverables: [
      "Optimized matrix multiplication code",
      "Benchmark script and latency/GFLOPs comparison table",
      "Performance analysis and numerical verification report",
    ],
    tools:
      "Python (NumPy, PyTorch, CuPy, Numba) or C++/CUDA. Disclose any AI assistance.",
    criteria:
      "Published employer review criteria (human review only): numerical verification, measurable speedup and optimization choice, benchmark rigor, and architectural explanation.",
    eligibility:
      "Currently enrolled student or recent graduate in CS, CE, SE, or Mathematics; self-declared work authorization.",
    rubric: [
      {
        id: "matmul-correctness",
        label: "Numerical correctness & verification",
        weight: 30,
        description:
          "Verifies FP32 output accuracy within tolerance across matrix dimensions.",
      },
      {
        id: "matmul-optimization",
        label: "Optimization implementation & speedup",
        weight: 35,
        description:
          "Effective use of vectorization, tiling, or GPU kernels with clear speedup.",
      },
      {
        id: "matmul-benchmarks",
        label: "Benchmarking methodology",
        weight: 20,
        description:
          "Includes warmup iterations, multiple matrix sizes, and GFLOP/s calculations.",
      },
      {
        id: "matmul-analysis",
        label: "Performance analysis & reasoning",
        weight: 15,
        description:
          "Explains memory bandwidth vs. compute bottlenecks and scaling behavior.",
      },
    ],
  },
  {
    id: "marketing",
    title: "Reliability Engineering Intern",
    company: "Thermo Fisher Scientific",
    industry: "Engineering",
    majors: [
      "Mechanical Engineering",
      "Electrical Engineering",
      "Industrial Engineering",
    ],
    tags: [
      "thermo fisher",
      "reliability",
      "condition monitoring",
      "vibration",
      "temperature",
      "maintenance",
    ],
    location: "Mississauga, ON",
    arrangement: "Onsite",
    type: "Internship",
    paid: true,
    pay: 27,
    duration: 4,
    effort: 2.5,
    description:
      "Fictional Demo — Not affiliated with Thermo Fisher Scientific. Join our fictional Instrumentation Reliability Engineering team to analyze equipment vibration and thermal telemetry and prevent unplanned downtime.",
    responsibilities:
      "Analyze equipment vibration and temperature time-series data, distinguish sensor noise from mechanical wear, and write preventive maintenance recommendations.",
    dayInTheRole:
      "Reliability engineers monitor sensor streams from analytical and manufacturing equipment, track vibration RMS and bearing temperature trends, and schedule targeted maintenance before a component fails in production.",
    qualifications:
      "Background in mechanical, electrical, or industrial engineering, basic statistics or signal analysis, and data plotting.",
    challenge:
      "Analyze Equipment Vibration and Temperature Data to Identify Potential Failures",
    scenario:
      "You receive synthetic equipment sensor readings (vibration RMS in mm/s and motor housing temperature in °C) across three laboratory centrifuge units over 12 days. Develop a condition-monitoring analysis that identifies which unit is degrading and recommend a maintenance action plan.",
    specifications: [
      "Nominal operating range: vibration RMS <= 2.8 mm/s and temperature <= 52.0 °C",
      "Warning zone: vibration RMS > 4.0 mm/s or sustained temperature drift > +1.5 °C/day",
      "Critical alarm zone: vibration RMS >= 6.5 mm/s or temperature >= 65.0 °C",
      "Distinguish isolated single-point sensor glitches from sustained mechanical degradation",
    ],
    skills: [
      "Reliability Engineering",
      "Condition Monitoring",
      "Sensor Data Analysis",
      "Data Visualization",
      "Maintenance Planning",
    ],
    starterMaterials: [
      {
        name: "equipment_sensor_readings.csv",
        description:
          "Synthetic 12-day vibration (mm/s RMS) and temperature (°C) telemetry for Units A, B, and C.",
        content: `Day,Unit,Vibration_mm_s,Temp_C
1,Unit-A,2.1,46.2
2,Unit-A,2.2,46.5
3,Unit-A,2.1,46.4
4,Unit-A,7.9,46.6
5,Unit-A,2.2,46.5
6,Unit-A,2.3,46.7
1,Unit-B,2.4,47.0
2,Unit-B,2.9,48.8
3,Unit-B,3.6,51.2
4,Unit-B,4.4,54.5
5,Unit-B,5.6,58.9
6,Unit-B,6.8,65.4
1,Unit-C,1.9,45.1
2,Unit-C,2.0,45.3
3,Unit-C,1.9,45.0
4,Unit-C,2.1,45.4
5,Unit-C,2.0,45.2
6,Unit-C,2.0,45.3
`,
      },
    ],
    acceptanceCriteria: [
      "Correctly identifies Unit-B as undergoing progressive bearing/thermal degradation reaching the critical alarm zone",
      "Identifies Day 4 on Unit-A as an isolated single-point sensor spike rather than sustained mechanical failure",
      "Includes clear time-series plots of vibration and temperature with threshold bands",
      "Provides concrete maintenance and sensor-verification recommendations",
    ],
    instructions:
      "Analyze the provided synthetic equipment vibration and temperature dataset. Plot condition-monitoring trends, separate isolated sensor spikes from progressive wear, and write a concise maintenance recommendation report.",
    deliverables: [
      "Data analysis script or worksheet",
      "Vibration and temperature trend visualizations with threshold lines",
      "Maintenance recommendations and root-cause summary",
    ],
    tools:
      "Python, R, MATLAB, or spreadsheet software. Disclose any AI assistance.",
    criteria:
      "Published employer review criteria (human review only): accuracy of trend vs. spike classification, clarity of condition-monitoring plots, and practicality of maintenance recommendations.",
    eligibility:
      "Currently enrolled engineering student or recent graduate; self-declared work authorization.",
    rubric: [
      {
        id: "failure-detection",
        label: "Degradation vs. spike identification",
        weight: 35,
        description:
          "Correctly separates Unit-B progressive failure from Unit-A single-sample spike.",
      },
      {
        id: "monitoring-plots",
        label: "Condition-monitoring visualizations",
        weight: 25,
        description:
          "Clear trend plots showing warning and critical threshold zones.",
      },
      {
        id: "maintenance-plan",
        label: "Maintenance recommendations",
        weight: 25,
        description:
          "Actionable inspection schedule for Unit-B and sensor check for Unit-A.",
      },
      {
        id: "report-clarity",
        label: "Clarity & assumptions",
        weight: 15,
        description:
          "Concise engineering communication and stated limitations of synthetic data.",
      },
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst Intern",
    company: "Northstar Labs",
    industry: "Software & AI",
    majors: ["Data Science", "Statistics", "Computer Science"],
    tags: ["data", "analytics", "sql", "python", "cohort"],
    location: "Toronto",
    arrangement: "Remote",
    type: "Internship",
    paid: true,
    pay: 26,
    duration: 4,
    effort: 3,
    description:
      "Fictional Demo — Not affiliated with this company. Join the fictional Northstar Labs Product Analytics team to audit event telemetry, clean messy data, and surface retention insights.",
    responsibilities:
      "Audit product event logs for schema anomalies, compute cohort retention metrics, and communicate data quality caveats to product and engineering teams.",
    dayInTheRole:
      "Product data analysts spend significant time validating raw telemetry schemas, deduplicating retry events, and verifying metric definitions before building dashboards.",
    qualifications:
      "Experience with Python or SQL data cleaning, descriptive statistics, and clear analytical writing.",
    challenge: "Audit and Clean a Product Telemetry Dataset",
    scenario:
      "A fictional onboarding funnel log contains duplicate client retries, missing timestamps, and mixed timezone records. Clean the dataset and compute verified 7-day activation rates.",
    specifications: [
      "Deduplicate identical (user_id, event_type, minute_bucket) retry events",
      "Quarantine rows with null timestamps and report the exclusion rate",
      "Compute 7-day activation conversion by signup channel",
    ],
    skills: ["Data Cleaning", "Python / SQL", "Cohort Analysis", "Data Quality"],
    starterMaterials: [
      {
        name: "onboarding_events_synthetic.csv",
        description: "Synthetic signup and activation event log with duplicate retries.",
        content: `event_id,user_id,channel,event_type,timestamp_utc\n1,u101,organic,signup,2026-10-01T10:00:00Z\n2,u101,organic,signup,2026-10-01T10:00:02Z\n3,u101,organic,activated,2026-10-03T14:20:00Z\n4,u102,referral,signup,2026-10-01T11:15:00Z\n5,u102,referral,activated,\n`,
      },
    ],
    acceptanceCriteria: [
      "Reports both raw and deduplicated activation rates",
      "Clearly documents excluded rows and assumptions",
    ],
    instructions:
      "Clean the provided fictional customer telemetry dataset, summarize verified activation patterns, and communicate data limitations.",
    deliverables: [
      "Data-cleaning script or notebook",
      "Summary table of cleaned metrics and data-quality limitations",
    ],
    tools: "Python, SQL, or spreadsheets. Disclose AI assistance.",
    criteria:
      "Human reviewers evaluate deduplication logic, metric accuracy, and transparency about data limitations.",
    eligibility:
      "Currently enrolled student or recent graduate; self-declared work authorization.",
    rubric: [
      {
        id: "cleaning",
        label: "Data cleaning & deduplication",
        weight: 40,
        description: "Correctly handles duplicate events and missing timestamps.",
      },
      {
        id: "metrics",
        label: "Metric calculation accuracy",
        weight: 35,
        description: "Accurate cohort conversion calculation from cleaned data.",
      },
      {
        id: "communication",
        label: "Data limitation reporting",
        weight: 25,
        description: "Clear summary of anomalies and sample-size caveats.",
      },
    ],
  },
  {
    id: "product-design",
    title: "Product Design Intern",
    company: "Forma Collective",
    industry: "Design",
    majors: ["Interaction Design", "Industrial Design", "Human-Computer Interaction"],
    tags: ["design", "ux", "accessibility", "onboarding", "figma"],
    location: "Vancouver",
    arrangement: "Hybrid",
    type: "Internship",
    paid: true,
    pay: 24,
    duration: 4,
    effort: 2.5,
    description:
      "Fictional Demo — Not affiliated with this company. Work with the fictional Forma Collective design systems team to design accessible, task-focused product workflows.",
    responsibilities:
      "Create low-to-mid fidelity user flows, design accessible form and empty states, and document interaction rationale for engineering handoff.",
    dayInTheRole:
      "Product designers translate ambiguous user friction into clear screen flows, keyboard-accessible states, and annotated edge cases for engineers.",
    qualifications:
      "Portfolio or coursework in interaction design, wireframing, and WCAG accessibility fundamentals.",
    challenge: "Design an Accessible Lab-Equipment Booking Flow",
    scenario:
      "Students booking shared engineering lab benches frequently miss safety-certification prerequisites. Design a 3-step booking flow that surfaces prerequisite status clearly.",
    specifications: [
      "Include prerequisite check, time-slot selection, and confirmation/error states",
      "Specify keyboard navigation order and WCAG AA contrast considerations",
    ],
    skills: ["Interaction Design", "Wireframing", "Accessibility (WCAG)", "UX Writing"],
    starterMaterials: [
      {
        name: "booking_constraints_brief.md",
        description: "User personas, lab rules, and error states to cover.",
        content: `# Fictional Lab Booking Brief\nUsers: 2nd-year engineering students.\nConstraint: Laser cutter requires Module-2 badge; oscilloscope bench requires basic lab orientation.`,
      },
    ],
    acceptanceCriteria: [
      "Covers happy path and missing-prerequisite state",
      "Includes accessibility and keyboard-focus annotations",
    ],
    instructions:
      "Design a 3-step onboarding and booking flow for a fictional campus engineering lab. Explain the user problem, state transitions, and accessibility choices.",
    deliverables: [
      "Wireframes or interactive prototype link",
      "Short design rationale covering edge cases and accessibility",
    ],
    tools: "Figma, Penpot, or sketched wireframes. Disclose AI assistance.",
    criteria:
      "Human reviewers evaluate task clarity, edge-case coverage, and accessibility annotations.",
    eligibility:
      "Currently enrolled student or recent graduate; self-declared work authorization.",
    rubric: [
      {
        id: "flow-clarity",
        label: "User flow & state coverage",
        weight: 40,
        description: "Clear progression across normal and blocked prerequisite states.",
      },
      {
        id: "accessibility",
        label: "Accessibility & inclusive design",
        weight: 35,
        description: "Explicit keyboard, contrast, and error-messaging considerations.",
      },
      {
        id: "rationale",
        label: "Design rationale & trade-offs",
        weight: 25,
        description: "Concise explanation of design decisions.",
      },
    ],
  },
  {
    id: "operations",
    title: "Operations Analyst",
    company: "Common Ground Logistics",
    industry: "Business & Finance",
    majors: [
      "Business Administration",
      "Supply Chain Management",
      "Industrial Engineering",
    ],
    tags: ["operations", "supply chain", "logistics", "process", "business"],
    location: "Montreal",
    arrangement: "Onsite",
    type: "Entry-level",
    paid: true,
    pay: 25,
    duration: 6,
    effort: 2.5,
    description:
      "Fictional Demo — Not affiliated with this company. Join the fictional Common Ground fulfillment operations team to analyze warehouse throughput, cycle times, and bottleneck stations.",
    responsibilities:
      "Map fulfillment workflows, quantify station cycle times and queue buildup, and propose measurable process improvements.",
    dayInTheRole:
      "Operations analysts study station-by-station timing data, calculate line capacity and utilization, and test layout or staffing changes before rollout.",
    qualifications:
      "Analytical coursework in operations, industrial engineering, or business administration.",
    challenge: "Diagnose a Fulfillment Packing Bottleneck",
    scenario:
      "A regional fulfillment line experiences a 28% backlog during peak afternoon hours. Use the synthetic station timing table to identify the bottleneck and evaluate two staffing options.",
    specifications: [
      "Station A (Pick): 45 sec/order, 2 operators",
      "Station B (Pack & Verify): 75 sec/order, 2 operators",
      "Station C (Label & Stage): 30 sec/order, 1 operator",
      "Calculate hourly capacity per station and recommend a reallocation",
    ],
    skills: [
      "Operations Analysis",
      "Capacity Modeling",
      "Process Mapping",
      "Quantitative Reasoning",
    ],
    starterMaterials: [
      {
        name: "fulfillment_station_timings.csv",
        description: "Synthetic station cycle times, operator counts, and defect rates.",
        content: `Station,Cycle_Time_Sec,Operators,Rework_Pct\nPick,45,2,1.5\nPack_Verify,75,2,4.0\nLabel_Stage,30,1,0.8\n`,
      },
    ],
    acceptanceCriteria: [
      "Calculates exact orders/hour capacity for each station",
      "Quantifies throughput gain and trade-offs of two proposed improvements",
    ],
    instructions:
      "Map the fictional order fulfillment process, calculate station capacities, and recommend two improvements with measurable success criteria.",
    deliverables: [
      "Capacity calculation worksheet and process map",
      "Short recommendation memo with measurable KPIs",
    ],
    tools: "Spreadsheet or process-mapping tools. Disclose AI assistance.",
    criteria:
      "Human reviewers evaluate capacity math, bottleneck identification, and practical operational reasoning.",
    eligibility:
      "Recent graduate or final-year student; self-declared work authorization.",
    rubric: [
      {
        id: "capacity-math",
        label: "Bottleneck & capacity calculations",
        weight: 40,
        description: "Accurate hourly throughput and utilization calculations.",
      },
      {
        id: "recommendations",
        label: "Process improvement design",
        weight: 35,
        description: "Feasible recommendations with quantified throughput impact.",
      },
      {
        id: "kpi-clarity",
        label: "Success metrics & trade-offs",
        weight: 25,
        description: "Clear KPIs, quality controls, and implementation risks.",
      },
    ],
  },
];
export function seed(now = new Date()): Store {
  const date = (days: number) =>
    new Date(now.getTime() + days * 86400000).toISOString();
  const opportunities: Opportunity[] = flagshipOpportunities.map((item, i) => ({
    ...item,
    deadline: date(18 + i * 3).slice(0, 10),
    reviewDays: i % 3 === 0 ? 7 : 5,
    challengeDays: 7,
    status: "Published",
    owner: "employer-demo",
    demo: true,
  }));
  opportunities.push(...expandedCatalog(now));
  for (const o of opportunities) {
    o.challengeDays = o.challengeDays || 7;
    if (!o.rubric?.length) {
      o.rubric = [
        {
          id: "reasoning",
          label: "Reasoning",
          weight: 40,
          description: "Explain the approach and assumptions.",
        },
        {
          id: "completeness",
          label: "Completeness",
          weight: 35,
          description: "Address the requested deliverables.",
        },
        {
          id: "communication",
          label: "Communication",
          weight: 25,
          description: "Communicate results and limitations clearly.",
        },
      ];
    }
  }
  const applications: Application[] = Array.from({ length: 7 }, (_, i) => {
    const stages: Application["stage"][] = [
      "Submitted",
      "Under Employer Review",
      "Shortlisted",
      "Draft",
      "Invited to Next Stage",
      "Submitted",
      "Under Employer Review",
    ];
    const own = i < 4;
    const sub = i === 3 ? null : date(i === 6 ? -12 : -i - 1);
    return {
      id: "application-" + i,
      opportunityId: opportunities[i % opportunities.length].id,
      studentId: own ? "alex" : "candidate-" + i,
      studentName: own
        ? "Alex Morgan"
        : ["", "", "", "", "Sam Patel", "Riley Brooks", "Morgan Lee"][i],
      university: own
        ? "York University"
        : [
            "",
            "",
            "",
            "",
            "Toronto Metropolitan University",
            "University of Waterloo",
            "York University",
          ][i],
      program: own
        ? "Computer Engineering · Year 2"
        : i === 4
          ? "Business Management"
          : "Engineering · Year 3",
      resume: own
        ? student.resume
        : "Fictional student resume. Academic projects and relevant coursework; no verified employment claims.",
      stage: stages[i],
      integrity:
        i === 5
          ? "Demo: human review recommended"
          : i === 3
            ? "Not checked"
            : "Demo: no flag",
      submittedAt: sub,
      reviewDue: sub
        ? new Date(
            new Date(sub).getTime() + opportunities[i].reviewDays * 86400000,
          ).toISOString()
        : null,
      reviewedAt: ["Shortlisted", "Invited to Next Stage"].includes(stages[i])
        ? date(-1)
        : null,
      notes:
        i === 5
          ? "Demo reviewer note: ask the student to explain the shared template."
          : "",
      followUp: false,
      clarification: "",
      text: "Demo project explanation: I explored the problem, prepared an example solution, and documented assumptions. Supporting material uses synthetic information.",
      links: ["https://github.com/example/fictional-project"],
      files: [],
      eligibility: {
        academic: true,
        authorization: i !== 6,
        availability: true,
        qualifications: true,
        acknowledgment: true,
      },
      history: [
        {
          stage: stages[i],
          at: sub || date(0),
          message: own
            ? "Fictional application loaded for your demo."
            : "Fictional candidate record.",
        },
      ],
    };
  });
  for (const a of applications) {
    a.studentEmail =
      a.studentId === "alex"
        ? student.email
        : a.studentName.toLowerCase().replace(/\s+/g, ".") + "@example.test";
    a.university = "";
    a.program = "";
    a.resume = "";
  }
  return {
    version: 2,
    user: null,
    profile: { ...student },
    opportunities: opportunities.map(developRole),
    applications,
    saved: [],
  };
}

const legacyTitles = new Set([
  "AI Developer Intern",
  "Frontend Developer Intern",
  "Business Analyst Intern",
  "Electrical Engineering Intern",
  "Marketing Intern",
  "Operations Analyst Intern",
]);

export function upgradeDemoCatalog(saved: Store, now = new Date()): Store {
  const defaults = seed(now);
  const byId = new Map(defaults.opportunities.map((o) => [o.id, o]));
  const known = new Set(saved.opportunities.map((o) => o.id));
  return {
    ...saved,
    profile: { ...saved.profile, university: "", program: "", resume: "" },
    user: saved.user
      ? { ...saved.user, university: "", program: "", resume: "" }
      : null,
    opportunities: [
      ...saved.opportunities.map((o) => {
        const fresh = byId.get(o.id);
        if (fresh && legacyTitles.has(o.title) && !o.screeningPolicy && !saved.applications.some(a=>a.opportunityId===o.id)) {
          return { ...fresh };
        }
        return {
          ...(fresh || {}),
          ...o,
          challengeDays: o.challengeDays || 7,
          rubric: o.rubric || fresh?.rubric || defaults.opportunities[0].rubric,
        };
      }),
      ...defaults.opportunities.filter((o) => !known.has(o.id)),
    ],
    applications: saved.applications.map((a) => ({
      ...a,
      studentEmail:
        a.studentEmail ||
        (a.studentId === saved.profile.id
          ? saved.profile.email
          : a.studentName.toLowerCase().replace(/\s+/g, ".") + "@example.test"),
      university: "",
      program: "",
      resume: "",
    })),
  };
}
