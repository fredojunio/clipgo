// Test script for the new video cutter
const { cutVideoClip, cutMultipleClips, validateVideoFile } = require('./src/app/lib/video-cutter.ts');
const path = require('path');

// Example usage
async function testVideoCutter() {
  // Example clip data
  const testClip = {
    start: 10,     // Start at 10 seconds
    end: 20,       // End at 20 seconds (10 second clip)
    title: "Test Clip",
    viralScore: 85
  };

  const inputPath = '/path/to/your/input/video.mp4'; // Update this path
  const outputDir = path.join(__dirname, 'output');

  try {
    // First, validate the input file
    console.log('Validating input file...');
    const isValid = await validateVideoFile(inputPath);
    if (!isValid) {
      console.log('❌ Input file is not valid or does not exist');
      return;
    }
    console.log('✅ Input file is valid');

    // Cut a single clip
    console.log('Cutting single clip...');
    const outputPath = await cutVideoClip(inputPath, outputDir, testClip, 0);
    console.log('✅ Single clip created:', outputPath);

    // Cut multiple clips with progress tracking
    const testClips = [
      { start: 5, end: 15, title: "Clip 1", viralScore: 90 },
      { start: 25, end: 35, title: "Clip 2", viralScore: 80 },
      { start: 45, end: 55, title: "Clip 3", viralScore: 75 }
    ];

    console.log('Cutting multiple clips...');
    const outputPaths = await cutMultipleClips(
      inputPath, 
      outputDir, 
      testClips,
      (progress) => {
        console.log(`Progress: ${progress.current}/${progress.total} clips completed`);
      }
    );
    console.log('✅ Multiple clips created:', outputPaths);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Uncomment the line below and update the input path to test
// testVideoCutter();

console.log('Test script loaded. Update the inputPath variable and uncomment testVideoCutter() to run.');