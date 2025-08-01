import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Editor } from '@monaco-editor/react';
import { saveAs } from 'file-saver';
import { convertYaml } from './utils/converter';
import { sampleYaml1to2, sampleYaml2to1, sampleComponentYaml1to2, sampleComponentYaml2to1 } from './test-samples';
import { componentYaml1, componentYaml2, apiYaml1, apiYaml2, resourceYaml1, resourceYaml2, templateYaml1, templateYaml2 } from './sample-entities';
import harnessLogo from './assets/logo-harness.svg';
import githubLogo from './assets/github-logo.svg';

// Global styles to set font family and base styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
    color: #07182B;
    background-color: #EFFBFF;
    background: linear-gradient(135deg, #EFFBFF 0%, #CDF4FE 100%);
  }
  
  * {
    box-sizing: border-box;
  }
  
  /* Responsive breakpoints */
  html {
    font-size: 16px;
  }
  
  @media (max-width: 1200px) {
    html {
      font-size: 15px;
    }
  }
  
  @media (max-width: 992px) {
    html {
      font-size: 14px;
    }
  }
  
  @media (max-width: 768px) {
    html {
      font-size: 13px;
    }
  }
  
  @media (max-width: 576px) {
    html {
      font-size: 12px;
    }
  }
`;

// Harness logo component using the SVG file from assets
const HarnessLogo = () => (
  <a href="https://www.harness.io" target="_blank" rel="noopener noreferrer" title="Visit Harness Website">
    <LogoImage src={harnessLogo} alt="Harness Logo" />
  </a>
);

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  display: block;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(163, 233, 255, 0.4) 0%, transparent 60%),
                radial-gradient(circle at bottom left, rgba(0, 173, 228, 0.3) 0%, transparent 50%);
    z-index: -1;
  }
`;

const Header = styled.header`
  background: linear-gradient(90deg, #0A3364 0%, #00BEF2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(205, 244, 254, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(205, 244, 254, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  padding: 2rem;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 992px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const Panel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 1.75rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(205, 244, 254, 0.5);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.isInput ? '#00ADE4' : '#0A3364'} 0%, ${props => props.isInput ? '#3DC7F6' : '#00ADE4'} 100%);
  }
  
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(205, 244, 254, 0.5);
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0A3364;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 10px;
    background-color: ${props => props.isInput ? '#00ADE4' : '#0A3364'};
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='${props => props.isInput ? 'M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 16h-4.83l-.59.59L12 20.17l-1.59-1.59-.58-.58H5V4h14v14zm-7-2h2V7h-4v2h2z' : 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2V7h-4v2h2z'}'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
  }
`;

const EditorContainer = styled.div`
  flex: 1;
  border: 1px solid rgba(205, 244, 254, 0.8);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
  position: relative;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const EntityTypeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const EntityTypeButton = styled.button`
  background-color: ${props => props.active ? '#00ADE4' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid ${props => props.active ? '#00ADE4' : '#d0d0d0'};
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#0095c8' : '#f5f5f5'};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#0063F7' : 'white'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: ${props => props.primary ? 'none' : '1px solid #d0d0d0'};
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.primary ? '0 2px 5px rgba(0, 99, 247, 0.3)' : 'none'};

  &:hover {
    background-color: ${props => props.primary ? '#0052CC' : '#f5f5f5'};
    transform: translateY(-1px);
    box-shadow: ${props => props.primary ? '0 4px 8px rgba(0, 99, 247, 0.4)' : 'none'};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.primary ? '0 1px 3px rgba(0, 99, 247, 0.3)' : 'none'};
  }

  &:disabled {
    background-color: ${props => props.primary ? '#99c2ff' : '#f0f0f0'};
    color: ${props => props.primary ? 'white' : '#999'};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  
  &::before {
    content: '';
    display: ${props => props.icon ? 'inline-block' : 'none'};
    width: 16px;
    height: 16px;
    margin-right: 8px;
    background-color: ${props => props.primary ? 'white' : '#555'};
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='${props => props.download ? 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' : props.copy ? 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z' : 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'}'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Select = styled.select`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  min-width: 200px;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 30px;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  
  &:hover, &:focus {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
  }
  
  option {
    background-color: white;
    color: #333;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
  background-color: #ffebee;
  border-left: 4px solid #d32f2f;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 10px;
    background-color: #d32f2f;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
  }
`;

const Footer = styled.footer`
  background-color: #f8f9fa;
  padding: 1rem 0;
  margin-top: auto;
  border-top: 1px solid #e9ecef;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
  
  @media (max-width: 768px) {
    padding: 1.5rem 0;
    height: auto;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #0A3364 0%, #00BEF2 100%);
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 0 1.5rem;
  }
`;

const GithubLink = styled.a`
  display: flex;
  align-items: center;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  margin-left: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #00ADE4;
  }
  
  img {
    margin-right: 0.5rem;
    width: 20px;
    height: 20px;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  position: absolute;
  left: 1rem;
`;

const FooterCenter = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const FooterRight = styled.div`
  text-align: right;
  margin-left: auto;
`;

const CreatorInfo = styled.div`
  font-size: 0.9rem;
  color: #333;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    background-color: #666;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
  }
`;

const HarnessLink = styled.a`
  color: #00ADE4;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: #0A3364;
    text-decoration: underline;
  }
`;

const CreatorLink = styled.a`
  color: #00ADE4;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: #0A3364;
    text-decoration: underline;
  }
`;

function App() {
  const [inputYaml, setInputYaml] = useState('');
  const [outputYaml, setOutputYaml] = useState('');
  const [direction, setDirection] = useState('1to2');
  const [error, setError] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [entityType, setEntityType] = useState('component');

  // Set initial sample YAML based on direction and entity type
  useEffect(() => {
    // Load the appropriate sample based on direction and entity type
    let sample = '';
    
    if (direction === '1to2') {
      switch (entityType) {
        case 'component':
          sample = componentYaml1;
          break;
        case 'api':
          sample = apiYaml1;
          break;
        case 'resource':
          sample = resourceYaml1;
          break;
        case 'template':
          sample = templateYaml1;
          break;
        default:
          sample = componentYaml1;
      }
    } else {
      switch (entityType) {
        case 'component':
          sample = componentYaml2;
          break;
        case 'api':
          sample = apiYaml2;
          break;
        case 'resource':
          sample = resourceYaml2;
          break;
        case 'template':
          sample = templateYaml2;
          break;
        default:
          sample = componentYaml2;
      }
    }
    
    setInputYaml(sample);
    setOutputYaml('');
    setError('');
  }, [direction, entityType]);

  const handleConvert = () => {
    if (!inputYaml) return;
    
    setIsConverting(true);
    setError('');
    
    try {
      // Ensure annotations persist for both 1.0 and 2.0 conversions
      const result = convertYaml(inputYaml, direction);
      setOutputYaml(result);
    } catch (err) {
      setError(err.message);
      setOutputYaml('');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDirectionChange = (e) => {
    setDirection(e.target.value);
  };
  
  const handleEntityTypeChange = (type) => {
    setEntityType(type);
  };

  const handleDownload = () => {
    if (!outputYaml) return;
    
    const blob = new Blob([outputYaml], { type: 'text/yaml;charset=utf-8' });
    const filename = direction === '1to2' ? 'converted_idp2.yaml' : 'converted_idp1.yaml';
    saveAs(blob, filename);
  };

  const handleCopy = () => {
    if (!outputYaml) return;
    navigator.clipboard.writeText(outputYaml);
  };

  const handleInputChange = (value) => {
    setInputYaml(value || '');
    setOutputYaml('');
    setError('');
  };

  return (
    <AppContainer>
      <GlobalStyle />
      <Header>
        <HeaderLeft>
          <HarnessLogo />
          <Title>Harness IDP YAML Converter</Title>
        </HeaderLeft>
        <HeaderRight>
          <Select value={direction} onChange={handleDirectionChange}>
            <option value="1to2">IDP 1.0 → IDP 2.0</option>
            <option value="2to1">IDP 2.0 → IDP 1.0</option>
          </Select>
        </HeaderRight>
      </Header>

      <MainContent>
        <Panel isInput>
          <PanelHeader>
            <PanelTitle isInput>Input YAML (IDP {direction === '1to2' ? '1.0' : '2.0'})</PanelTitle>
            <Button primary icon onClick={handleConvert} disabled={!inputYaml || isConverting}>
              Convert
            </Button>
          </PanelHeader>
          <EntityTypeSelector>
            <EntityTypeButton 
              active={entityType === 'component'} 
              onClick={() => handleEntityTypeChange('component')}
            >
              Component
            </EntityTypeButton>
            <EntityTypeButton 
              active={entityType === 'api'} 
              onClick={() => handleEntityTypeChange('api')}
            >
              API
            </EntityTypeButton>
            <EntityTypeButton 
              active={entityType === 'resource'} 
              onClick={() => handleEntityTypeChange('resource')}
            >
              Resource
            </EntityTypeButton>
            <EntityTypeButton 
              active={entityType === 'template'} 
              onClick={() => handleEntityTypeChange('template')}
            >
              Template/Workflow
            </EntityTypeButton>
          </EntityTypeSelector>
          <EditorContainer>
            <Editor
              height="100%"
              language="yaml"
              value={inputYaml}
              onChange={handleInputChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 1.6
              }}
            />
          </EditorContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Output YAML (IDP {direction === '1to2' ? '2.0' : '1.0'})</PanelTitle>
            <ButtonGroup>
              <Button icon copy onClick={handleCopy} disabled={!outputYaml}>
                Copy
              </Button>
              <Button icon download onClick={handleDownload} disabled={!outputYaml}>
                Download
              </Button>
            </ButtonGroup>
          </PanelHeader>
          <EditorContainer>
            <Editor
              height="100%"
              language="yaml"
              value={outputYaml}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 1.6
              }}
            />
          </EditorContainer>
        </Panel>
      </MainContent>

      <Footer>
        <FooterContent>
          <FooterLeft>
            <GithubLink href="https://github.com/ShibamD/harness-yaml-convertor" target="_blank" rel="noopener noreferrer">
              <img src={githubLogo} alt="GitHub" />
              Source Code
            </GithubLink>
            <CreatorInfo>Created by <CreatorLink href="https://in.linkedin.com/in/shibamdhar" target="_blank" rel="noopener noreferrer">&nbsp;Shibam Dhar</CreatorLink></CreatorInfo>
          </FooterLeft>
          <FooterRight>
            Powered by <HarnessLink href="https://www.harness.io/products/internal-developer-portal" target="_blank" rel="noopener noreferrer">Harness IDP</HarnessLink> | <HarnessLink href="https://developer.harness.io/docs/internal-developer-portal/catalog/catalog-yaml/" target="_blank" rel="noopener noreferrer">YAML Guide</HarnessLink>
          </FooterRight>
        </FooterContent>
      </Footer>
    </AppContainer>
  );
}

export default App;
