import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import LectureTable from './components/LectureTable';


const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<LectureTable />} />
            <Route path="/LectureTable" element={<LectureTable />} />

            <Route path="/LectureTable/:id/knowledge" element={
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <LectureTable />
              </Container>
            } />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
