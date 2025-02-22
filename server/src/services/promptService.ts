export class PromptService {
  constructor() {
    //
  }

  createPromptForViralSegments({
    stringifiedTranscription,
    desiredSegmentDuration,
  }: {
    stringifiedTranscription: string;
    desiredSegmentDuration: string; // Exemple: "30-60 secondes"
  }): string {
    return `
      You are an advanced, highly experienced AI model specializing in analyzing video or audio transcripts to detect the most viral-worthy moments. 
      Your objective is to return exactly **10** segments from the provided transcription that have the best chance of going viral.
      
      IMPORTANT DETAILS AND REQUIREMENTS:
      1. **Transcription**: 
        - Below is the entire transcription in a single JSON string format (without line breaks). 
        - Analyze it to identify which parts are the most engaging or have the highest virality potential (e.g., emotional peaks, humor, dramatic tension, etc.).
      
      2. **Segment Duration**: 
        - Each of the 10 segments you select should be within the range of ${desiredSegmentDuration}.
        - You can merge multiple consecutive sections from the transcript if needed to reach that duration range.
        - If the transcript is too short or too long to precisely fit the requested length, pick the best approximations that still produce 10 distinct moments.
      
      3. **Output Format**: 
        - Return your result as a **valid JSON array** of exactly **10** objects, with **no extra keys** and **no additional commentary** outside the JSON. 
        - Each object must have the form:
          \`\`\`
          {
            "rank": number,     // An integer from 1 to 10 (1 = highest viral potential)
            "start": number,    // Start time in seconds (approximate or exact if known)
            "end": number,      // End time in seconds (approximate or exact if known)
            "reason": string    // Why this segment is likely to go viral MUST BE IN TRANSCRIPTION LANGUAGE
          }
          \`\`\`
        - The key \`rank\` indicates the order of virality potential: 
          - \`rank = 1\` means the segment has the strongest chance to go viral, 
          - \`rank = 10\` is still potentially viral but the least among the chosen top 10.
        - Use short, direct \`reason\` explanations focusing on what makes each segment stand out (e.g., emotional punch, surprising facts, humor, etc.).
      
      4. **Additional Instructions**:
        - Do **not** add text or keys beyond the JSON array (e.g., no introductions, disclaimers, or disclaimers after the JSON).
        - If timestamps (start/end) are not entirely clear, you may estimate them. 
        - Be concise yet clear in your \`reason\` fields.
      
      5. **Transcription Provided**:
      \`\`\`
      ${stringifiedTranscription}
      \`\`\`
      
      Now, based on this transcription and the requirement that each chosen segment be about ${desiredSegmentDuration}, please:
      1) Select **exactly 10** segments.
      2) Provide them in descending order of virality potential (rank 1 to 10).
      3) Return only the JSON array described, with no extra commentary.

      return something like this:
      {
        "segments": [
          {
            "rank": 1,
            "start": 0,
            "end": 10,
            "reason": "This is a reason"
          },
          ...
        ]
      }
      
  `;
  }
}
