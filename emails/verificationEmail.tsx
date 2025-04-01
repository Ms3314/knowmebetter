import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
  Hr,
  Link,
  Img
} from '@react-email/components';

// VerificationEmail.tsx

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  // Make the verification code more visible
  const codeStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '12px 20px',
    margin: '10px 0',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    letterSpacing: '2px',
    textAlign: 'center' as const,
    color: '#333333'
  };
  
  // Content wrapper style
  const contentStyle = {
    padding: '20px',
    backgroundColor: '#ffffff', 
    borderRadius: '8px',
    maxWidth: '600px'
  };
  
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>KnowmeBetter Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana, Arial, sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here's your verification code: {otp} for KnowmeBetter</Preview>
      <Container style={{ backgroundColor: '#f9f9f9', padding: '30px 20px' }}>
        <Section style={contentStyle}>
          <Row>
            <Heading as="h2" style={{ color: '#333333', textAlign: 'center' }}>
              Welcome to KnowmeBetter!
            </Heading>
          </Row>
          
          <Hr style={{ borderColor: '#e0e0e0', margin: '20px 0' }} />
          
          <Row>
            <Text style={{ color: '#333333', fontSize: '16px' }}>
              Hello {username},
            </Text>
          </Row>
          
          <Row>
            <Text style={{ color: '#333333', fontSize: '16px' }}>
              Thank you for registering. Please use the following verification
              code to complete your registration:
            </Text>
          </Row>
          
          <Row>
            <Text style={codeStyle}>{otp}</Text> 
          </Row>
          
          <Row>
            <Text style={{ color: '#666666', fontSize: '14px' }}>
              This verification code will expire in 60 minutes.
            </Text>
          </Row>
          
          <Hr style={{ borderColor: '#e0e0e0', margin: '20px 0' }} />
          
          <Row>
            <Text style={{ color: '#666666', fontSize: '14px' }}>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
          
          <Row>
            <Text style={{ color: '#666666', fontSize: '12px', marginTop: '20px', textAlign: 'center' }}>
              &copy; {new Date().getFullYear()} KnowmeBetter. All rights reserved.
            </Text>
          </Row>
        </Section>
      </Container>
    </Html>
  );
}