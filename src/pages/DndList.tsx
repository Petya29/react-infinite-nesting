import React, { FC, useEffect, useState } from 'react';
import { Box, Container, List, Paper } from '@mui/material';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ITask } from '../models/ITask';
import { TaskAddInput } from '../components/TaskAddInput';
import { TaskItem } from '../components/TaskItem';

export const DndList: FC = () => {

    const [listRef] = useAutoAnimate<HTMLDivElement>({ duration: 150 });

    const [tasks, setTasks] = useState<ITask[]>([]);

    const moveTasks = (currIndex: number, newIndex: number) => {
        const taskStateCopy = [...tasks];
        const [reorderedItem] = taskStateCopy.splice(currIndex, 1);
        taskStateCopy.splice(newIndex, 0, reorderedItem);

        localStorage.setItem('tasks', JSON.stringify(taskStateCopy));
        setTasks(taskStateCopy);
    }

    const handleAddTask = (newTask: ITask) => {
        setTasks(prevState => {
            const updState = [...prevState, newTask];
            localStorage.setItem('tasks', JSON.stringify(updState));
            return updState;
        });
    }

    const handleEditTask = (task: ITask, index: number) => {
        setTasks(prevState => {
            const updState = [...prevState];
            updState[index] = task;
            localStorage.setItem('tasks', JSON.stringify(updState));
            return updState;
        });
    }

    const hadleRemoveTask = (id: string) => {
        setTasks(prevState => {
            const updState = prevState.filter(task => task.id !== id);
            localStorage.setItem('tasks', JSON.stringify(updState));
            return updState;
        });
    }

    useEffect(() => {
        const storageTasks = localStorage.getItem('tasks');

        if (storageTasks) {
            setTasks(JSON.parse(storageTasks));
        }
    }, []);

    return (
        <Container maxWidth='md'>
            <Box sx={{ marginTop: '20px' }}>
                <Paper sx={{ padding: '16px' }}>
                    <TaskAddInput setTask={handleAddTask} />
                    <List sx={{ width: '100%', marginTop: '20px' }}>
                        <Box ref={listRef}>
                            {tasks.map((task, i) => (
                                <TaskItem
                                    index={i}
                                    task={task}
                                    nestingLevel={1}
                                    reorder={moveTasks}
                                    editTask={handleEditTask}
                                    removeTask={hadleRemoveTask}
                                    key={task.id}
                                />
                            ))}
                        </Box>
                    </List>
                </Paper>
            </Box>
        </Container>
    )
}
