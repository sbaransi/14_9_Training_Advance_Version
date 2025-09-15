import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Lecture {
  id: number;
  name: string;
  email: string;
  age: number;
  courses_count: number;
  knowledge?: {
    domain: string;
    level: 'No knowledge' | 'Low' | 'Medium' | 'Expert';
  }[];
}

const LectureTable: React.FC = () => {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch lectures from API
    const fetchLectures = async () => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        console.log('Token type:', typeof token);
        console.log('Token length:', token?.length);
        if (!token) {
            console.log('No token found');
            setLectures([]);
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get('http://localhost:3000/api/lectures', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            setLectures(Array.isArray(data) ? data : []);
        } catch (error) {
            if ((error as any).response?.status === 401) {
                console.log('Not authenticated');
            } else {
                console.error('Error fetching lectures:', error);
            }
            setLectures([]);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLectures();
    }, []);

    if (loading) {
        return <Typography>Loading lectures...</Typography>;
    }

    const getKnowledgeLevel = (lecture: Lecture, domain: string) => {
        const knowledge = lecture.knowledge?.find(k => k.domain === domain);
        return knowledge ? knowledge.level : 'No knowledge';
    }

    const handleKnowledgeChange = async (lectureId: number, domain: string, level: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:3000/api/lectures/${lectureId}/knowledge`, {
                domain,
                level
            }, {
                headers: {
                     'Content-Type': 'application/json'
                }
            });

            console.log('Knowledge update response:', response.data);
            fetchLectures();
        } catch (error) {
            console.error('Error updating knowledge level:', error);
        }
    };

    const handleDelete = async (lectureId: number) => {
        console.log('=== DELETE LECTURE ===');
        console.log('Lecture ID to delete:', lectureId);
        console.log('Token:', localStorage.getItem('token'));

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Delete response:', response.data);

            // Refresh the lectures list after successful delete
            fetchLectures();

        } catch (error) {
            console.error('Delete error:', error);
            if ((error as any).response?.status === 401) {
                console.error('Unauthorized - token might be expired');
            }
        }
    };
    return (
        <Box sx={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            width: '100%',
            margin: 0,
            padding: 0
        }}>
            <Box sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" component="h1">
                        Lectures Knowledge Managment
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/tasks/new')}
                    >
                        Add Task
                    </Button>
                </Box>
            </Box>

            <Box sx={{ flex: 1, p: 0 }}>
                <TableContainer
                    component={Paper}
                    sx={{
                        height: '100%',
                        overflowX: 'auto',
                        minHeight: 0
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 180}}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>Age</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>Courses Count</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>Full Stack Dev</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>AI Tools</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>n8n</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>MySQL</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>MongoDB</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>Node.js</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: 80}}>Typescript</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lectures.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No lectures found. Click "Add Lecture" to create your first lecture!
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                lectures.map((lecture) => (
                                    <TableRow key={lecture.id}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{lecture.id}</TableCell>
                                        <TableCell sx={{ wordBreak: 'break-word' }}>{lecture.name}</TableCell>
                                        <TableCell sx={{ wordBreak: 'break-word' }}>{lecture.email}</TableCell>
                                        <TableCell>{lecture.age}</TableCell>
                                        <TableCell>{lecture.courses_count}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={getKnowledgeLevel(lecture, 'Full Stack Dev')}
                                                onChange={(e) => handleKnowledgeChange(lecture.id, 'Full Stack Dev', e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="No knowledge">No knowledge</MenuItem>
                                                <MenuItem value="Low">Low</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Expert">Expert</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={getKnowledgeLevel(lecture, 'AI Tools')}
                                                onChange={(e) => handleKnowledgeChange(lecture.id, 'AI Tools', e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="No knowledge">No knowledge</MenuItem>
                                                <MenuItem value="Low">Low</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Expert">Expert</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={getKnowledgeLevel(lecture, 'n8n')}
                                                onChange={(e) => handleKnowledgeChange(lecture.id, 'n8n', e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="No knowledge">No knowledge</MenuItem>
                                                <MenuItem value="Low">Low</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Expert">Expert</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={getKnowledgeLevel(lecture, 'MySQL')}
                                                onChange={(e) => handleKnowledgeChange(lecture.id, 'MySQL', e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="No knowledge">No knowledge</MenuItem>
                                                <MenuItem value="Low">Low</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Expert">Expert</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={getKnowledgeLevel(lecture, 'MongoDB')}
                                                onChange={(e) => handleKnowledgeChange(lecture.id, 'MongoDB', e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="No knowledge">No knowledge</MenuItem>
                                                <MenuItem value="Low">Low</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Expert">Expert</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={getKnowledgeLevel(lecture, 'Node.js')}
                                                onChange={(e) => handleKnowledgeChange(lecture.id, 'Node.js', e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="No knowledge">No knowledge</MenuItem>
                                                <MenuItem value="Low">Low</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Expert">Expert</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={getKnowledgeLevel(lecture, 'Typescript')}
                                                onChange={(e) => handleKnowledgeChange(lecture.id, 'Typescript', e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="No knowledge">No knowledge</MenuItem>
                                                <MenuItem value="Low">Low</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Expert">Expert</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => navigate(`/lectures/${lecture.id}/edit`)}
                                                sx={{ mr: 1 }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(lecture.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default LectureTable;