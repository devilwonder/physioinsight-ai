# PhysioInsight AI

PhysioInsight AI is an intelligent physiotherapy feedback analysis system. It leverages the power of Google Gemini to analyze patient feedback, providing therapists with actionable clinical insights and sentiment analysis.

## Key Features

- **Automated Feedback Analysis**: Instantly processes patient comments using Gemini AI.
- **Sentiment Scoring**: Visualizes patient satisfaction trends.
- **Clinical Insights**: Identifies key themes and provides specific actionable suggestions.
- **Clinical Flagging**: Automatically flags safety concerns or urgent issues (e.g., unexpected pain).
- **Dual View Interface**: Includes both a patient entry form and a professional therapist dashboard.

## Run Locally

**Prerequisites:** Node.js (v18 or later recommended)

1.  **Clone/Download** the repository.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Open [.env.local](.env.local) and set your `GEMINI_API_KEY`:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```
    *Note: You will need a Google Gemini API key to enable AI features.*

4.  **Launch the app**:
    ```bash
    npm run dev
    ```

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini Pro
- **Charts**: Recharts
- **Icons**: Lucide React
# physioinsight-ai
