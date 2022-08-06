import React, { FC } from 'react';
import { Alert, Box, List, ListItem } from '@mui/material';
import { ITask } from '../models/ITask';
import { TaskItem } from './TaskItem';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface ISubTasksList {
    subTasks: ITask[],
    nestingLevel: number,
    moveSubTasks: (currIndex: number, newIndex: number) => void,
    handleEditTask: (newTask: ITask, i: number) => void,
    removeSubTask: (id: string) => void
}

export const SubTasksList: FC<ISubTasksList> = ({
    subTasks,
    nestingLevel,
    moveSubTasks,
    handleEditTask,
    removeSubTask,
    ...props
}) => {

    const [listRef] = useAutoAnimate<HTMLDivElement>();

    return (
        <List>
            <Box ref={listRef}>
                {subTasks.map((subTask, i) => (
                    <TaskItem
                        index={i}
                        task={subTask}
                        nestingLevel={nestingLevel + 1}
                        reorder={moveSubTasks}
                        editTask={handleEditTask}
                        removeTask={() => removeSubTask(subTask.id)}
                        key={subTask.id}
                    />
                ))}
                {!subTasks.length &&
                    <ListItem>
                        <Alert severity='info' sx={{ width: '100%' }}>
                            You have no subTasks
                        </Alert>
                    </ListItem>
                }
            </Box>
        </List>
    )
}
