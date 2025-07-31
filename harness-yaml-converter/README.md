# Harness YAML Converter

A web application for converting Harness YAML between version 1.0 and 2.0 formats.

## Features

- Convert YAML between Harness IDP 1.0 and 2.0 formats
- Split-pane interface with input on the left and output on the right
- Syntax highlighting for YAML
- Copy to clipboard and download functionality
- Simple and intuitive UI

## Supported Conversions

### IDP 1.0 to IDP 2.0
- Template → Workflow
- API → API
- Resource → Resource

### IDP 2.0 to IDP 1.0
- Workflow → Template
- API → API
- Resource → Resource

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd harness-yaml-converter
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Build for production
```bash
npm run build
```

## How to Use

1. Select the conversion direction from the dropdown menu (1.0 → 2.0 or 2.0 → 1.0)
2. Paste your YAML content into the left panel
3. Click the "Convert" button
4. View the converted YAML in the right panel
5. Copy the result to clipboard or download it as a file

## License

ISC
