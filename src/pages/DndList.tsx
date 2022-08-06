import React, { FC, useState } from 'react';
import { Box, Container, Divider, List, Paper } from '@mui/material';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ITask } from '../models/ITask';
import { TaskAddInput } from '../components/TaskAddInput';
import { TaskItem } from '../components/TaskItem';

export const DndList: FC = () => {

    const [listRef] = useAutoAnimate<HTMLDivElement>();

    const [tasks, setTasks] = useState<ITask[]>([]);

    const moveTasks = (currIndex: number, newIndex: number) => {
        const taskStateCopy = [...tasks];
        const [reorderedItem] = taskStateCopy.splice(currIndex, 1);
        taskStateCopy.splice(newIndex, 0, reorderedItem);

        setTasks(taskStateCopy);
    }

    const handleAddTask = (newTask: ITask) => {
        setTasks(prevState => {
            return [...prevState, newTask];
        });
    }

    const handleEditTask = (task: ITask, index: number) => {
        setTasks(prevState => {
            const updState = [...prevState];
            updState[index] = task;
            return updState;
        });
    }

    const hadleRemoveTask = (id: string) => {
        setTasks(prevState => {
            return prevState.filter(task => task.id !== id);
        });
    }

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
                                    isLast={(tasks.length - 1) === i ? true : false}
                                    isFirst={i === 0 ? true : false}
                                    reorder={moveTasks}
                                    editTask={handleEditTask}
                                    removeTask={hadleRemoveTask}
                                    key={task.id}
                                />
                            ))}
                            <Divider />
                        </Box>
                    </List>
                </Paper>
            </Box>
        </Container>
    )
}
