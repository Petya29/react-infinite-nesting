import React, { FC, Fragment, useRef, useState } from 'react';
import { Box, IconButton, ListItemText, useTheme } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ITask } from '../models/ITask';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { TaskAddInput } from './TaskAddInput';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { SubTasksList } from './SubTasksList';
import { IDragItem } from '../models/IDragItem';

interface ITaskItem {
    index: number,
    task: ITask,
    nestingLevel: number,
    reorder: (currIndex: number, newIndex: number) => void,
    editTask: (task: ITask, index: number) => void,
    removeTask: (id: string) => void,
}

export const TaskItem: FC<ITaskItem> = ({
    index,
    task,
    nestingLevel,
    reorder,
    editTask,
    removeTask,
    ...props
}) => {

    const [listRef] = useAutoAnimate<HTMLDivElement>({ duration: 150, });

    const dragRef = useRef<HTMLSpanElement>(null); // drag handle
    const previewRef = useRef<HTMLDivElement>(null); // drag item

    const theme = useTheme();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [{ isDragging }, drag, preview] = useDrag({
        type: `TASK${nestingLevel}`,
        item: () => {
            return {
                task: task,
                oldIndex: index,
                index: index
            } as IDragItem
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [{ handlerId }, drop] = useDrop<IDragItem, void, { handlerId: Identifier | null }>({
        accept: `TASK${nestingLevel}`,
        collect: monitor => {
            return { handlerId: monitor.getHandlerId() }
        },
        hover: (item, monitor) => {
            if (!previewRef.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) return;

            // Determine rectangle on screen
            const hoverBoundingRect = previewRef.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            // Time to actually perform the action
            reorder(dragIndex, hoverIndex);

            item.index = hoverIndex;
        }
    });

    const moveSubTasks = (currIndex: number, newIndex: number) => {
        const updSubTasks = [...task.subTasks];
        const [reorderedItem] = updSubTasks.splice(currIndex, 1);
        updSubTasks.splice(newIndex, 0, reorderedItem);

        const editedTask = { ...task, subTasks: updSubTasks };
        editTask(editedTask, index);
    }

    const handleOpen = () => {
        setIsOpen(prevState => !prevState);
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

    const opacity = isDragging ? 0 : 1;
    drag(dragRef);
    drop(preview(previewRef));

    return (
        <Fragment>
            <Box
                ref={previewRef}
                component={'li'}
                data-handler-id={handlerId}
                sx={{
                    display: 'list-item',
                    opacity: opacity,
                    paddingTop: '8px',
                    borderBottom: `1px solid ${theme.palette.action.focus}`,
                    borderTop: `1px solid ${index === 0 ? theme.palette.action.focus : 'inherit'}`
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        ref={dragRef}
                        component={'span'}
                        sx={{ paddingTop: '6px', paddingRight: '16px' }}
                    >
                        <DragIndicatorIcon sx={{ cursor: 'grab' }} />
                    </Box>
                    <ListItemText primary={task.title} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '14px' }}>
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
                </Box>
                <Box ref={listRef} sx={{ marginTop: '8px', marginLeft: '30px' }}>
                    {isOpen &&
                        <Fragment>
                            <TaskAddInput setTask={addSubTask} />
                            <SubTasksList
                                subTasks={task.subTasks}
                                nestingLevel={nestingLevel + 1}
                                moveSubTasks={moveSubTasks}
                                handleEditTask={handleEditTask}
                                removeSubTask={removeSubTask}
                            />
                        </Fragment>
                    }
                </Box>
            </Box>
        </Fragment>
    )
}
