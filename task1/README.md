Q) Sort an array from 10 Gigabytes of unsorted integer data. The problem is you have
a device with 1GB RAM and 240GB of the hard drive.

Possible solution:
1. Split input file into small files. Size of these small files should be less that the RAM size.
2. Sort these small files.
3. Open each small file and use heap sort to output the data to output file.

  Reference links:
- https://www.geeksforgeeks.org/sorting-larger-file-with-smaller-ram/
- https://techdose.co.in/how-to-sort-a-very-large-file-external-sorting-technique/
- https://leetcode.com/problems/merge-k-sorted-lists/

// Pseudo Code
function SortLargeFile(inputPath, outputPath) {
	try {
		chunkSize = getAppropriateChunkSize();
		inputFileSize = getInputFileSize(inputSize);

        // If the provided file size is small enough, sort and return
        if (inputFileSize <= chunkSize) {
            sortSmallFile(inputPath);
            copy inputFile to outputPath
            return;
        }

        smallFilePaths = splitFileInChunks(inputPath, chunkSize, outputPath);
        /**
         * splitFileInChunks(inputPath, chunkSize, outputPath)
         *     This will save small files in outputPath and return array of paths of each small file
         *     smallFilePaths = ['/outputPath/smf1', '/outputPath/smf2', ..., '/outputPath/smfn']
         **/

        for(sfp of smallFilePaths) {
            sortSmallFile(sfp);
        }

        mergeKSortedFiles(smallFilePaths, outputPath);
		return true;
    } catch(err) {
        return;
    }

}

function mergeKSortedFiles(smallFilePaths, outputPath) {
	let numberOfFiles = smallFilePaths.length;
	
	/**
	 * minHeap(length):
	 *   creates minHeap of size length and returns object {
	 *       insert: function(IntegerFile) -> takes IntegerFile as input, uses integerFile.curInteger() to
	 *                                        read integer and position the object accordingly in the heap.
	 *       extract_min: function()       -> extracts corresponding object of minimum interger and removes from the heap.
	 *       empty: function()             -> return true is heap is empty, else returns false.
	 *   }
	 */
	let minHeap = new MinHeap(numberOfFiles);
	
	/**
	 * IntegerFile(filePath):
	 *   returns object that reads from filePath {
	 *       curInteger: function()  -> returns current interger being pointed
	 *       moveForward: function() -> moves iterator forward, if next number exists returns true else returns false
	 *       write: function(num)    -> appends num to file
	 *       close: function()       -> closes file
	 *   }
	 */
	for(let i=0; i < numberOfFiles; ++i) {
		minHeap.insert(new IntegerFile(smallFilePaths[i]));
	}
	
	let outputFile = new IntegerFile(outputPath+"/outputfile");
	while(!minHeap.empty()) {
		let fileObj = minHeap.extract_min();
		outputFile.write(fileObj.curInteger());

		if(fileObj.moveForward()) {
			minHeap.insert(fileObj);
		} else {
			fileObj.close();
		}
	}
	outputFile.close();
}