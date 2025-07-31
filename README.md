# Harness YAML Converter

A modern web application for converting Harness YAML between IDP 1.0 and 2.0 formats.

## Features

- Convert between Harness IDP 1.0 and 2.0 YAML formats
- Modern, responsive UI with Harness branding
- Split-pane interface for easy comparison
- Download or copy converted YAML
- Pre-loaded sample YAML for testing

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ShibamD/harness-yaml-convertor.git
   ```

2. Navigate to the project directory:
   ```
   cd harness-yaml-convertor/harness-yaml-converter
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Usage

1. Select the conversion direction from the dropdown (IDP 1.0 → IDP 2.0 or IDP 2.0 → IDP 1.0)
2. Enter or modify the YAML in the input editor on the left
3. Click the "Convert" button to generate the converted YAML
4. View the converted YAML in the output editor on the right
5. Use the "Copy" or "Download" buttons to save the converted YAML

## Supported Entity Types

- Component
- Template
- API
- Resource

## Created By

[Shibam Dhar](https://in.linkedin.com/in/shibamdhar)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Powered by [Harness IDP](https://www.harness.io/products/internal-developer-portal)
