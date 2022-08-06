import React, { FC, Fragment, useState } from 'react';
import { Box, Divider, IconButton, ListItem, ListItemText } from '@mui/material';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ITask } from '../models/ITask';
import { TaskAddInput } from './TaskAddInput';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { SubTasksList } from './SubTasksList';

interface ITaskItem {
    index: number,
    task: ITask,
    isLast: boolean,
    isFirst: boolean,
    reorder: (currIndex: number, newIndex: number) => void,
    editTask: (task: ITask, index: number) => void,
    removeTask: (id: string) => void,
}

export const TaskItem: FC<ITaskItem> = ({
    index,
    task,
    isLast,
    isFirst,
    reorder,
    editTask,
    removeTask,
    ...props
}) => {

    const [listRef] = useAutoAnimate<HTMLDivElement>();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const hadleReorder = (type: ('up' | 'down')) => {
        if (type === 'up') {
            reorder(index, index - 1);
        } else {
            reorder(index, index + 1);
        }
    }

    const moveSubTasks = (currIndex: number, newIndex: number) => {
        const updSubTasks = [...task.subTasks];
        const [reorderedItem] = updSubTasks.splice(currIndex, 1);
        updSubTasks.splice(newIndex, 0, reorderedItem);

        const editedTask = { ...task, subTasks: updSubTasks };
        editTask(editedTask, index);
    }

    const handleOpen = () => {
        setIsOpen(prevState => {
            return !prevState;
        })
    }

    const addSubTask = (newTask: ITask) => {
        const editedTask = { ...task, subTasks: [...task.subTasks, newTask] };
        editTask(editedTask, index);
    }

    const handleEditTask = (newTask: ITask, i: number) => {
        const editedTask = { ...task };
        editedTask.subTasks[i] = newTask;
        editTask(editedTask, index);
    }

    const removeSubTask = (id: string) => {
        const updSubTasks = task.subTasks.filter(subTask => subTask.id !== id);
        const editedTask = { ...task, subTasks: updSubTasks };
        editTask(editedTask, index);
    }

    return (
        <Fragment>
            <Divider />
            <ListItem>
                <ListItemText primary={task.title} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '14px' }}>
                    <IconButton
                        disabled={isFirst}
                        edge="end"
                        aria-label="up"
                        onClick={() => hadleReorder('up')}
                    >
                        <NorthIcon />
                    </IconButton>
                    <IconButton
                        disabled={isLast}
                        edge="end"
                        aria-label="down"
                        onClick={() => hadleReorder('down')}
                    >
                        <SouthIcon />
                    </IconButton>
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeTask(task.id)}
                    >
                        <DeleteForeverIcon />
                    </IconButton>
                    <IconButton
                        edge="end"
                        aria-label="open"
                        onClick={handleOpen}
                    >
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
            </ListItem>
            <Box ref={listRef} sx={{ marginLeft: '30px' }}>
                {isOpen &&
                    <Fragment>
                        <TaskAddInput setTask={addSubTask} />
                        <SubTasksList
                            subTasks={task.subTasks}
                            moveSubTasks={moveSubTasks}
                            handleEditTask={handleEditTask}
                            removeSubTask={removeSubTask}
                        />
                    </Fragment>
                }
            </Box>
        </Fragment>
    )
}
