// src/components/Task2.tsx
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Table, Input, Button, Checkbox, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { addTask, toggleTask, deleteTask, setFilter, setTasks } from '../redux/taskSlice'; 
import { addT, deleteT, getT } from '../service/taskApi'

const Task2: React.FC = () => {
    const [task, setTask] = useState('');
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { tasks, filter } = useSelector((state: RootState) => state.tasks);

    const counter = useRef(0);
    useEffect(() => {
        async function fetchTasks() {
            try {
                const data = await getT();
                counter.current = data.length;
                dispatch(setTasks(data));
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        }
        fetchTasks();
    }, [dispatch]);

    const filteredTasks = useMemo(() => {
        if (filter === 'completed') return tasks.filter(task => task.completed);
        if (filter === 'pending') return tasks.filter(task => !task.completed);
        return tasks;
    }, [tasks, filter]);

    const handleAdd = async () => {
 
        if (task.trim() === '') {
            alert(t('alert'));
            return;
        }
        const newTask = {
            id: (counter.current+=1).toString(),
            title: task.trim(),
            completed: false,
        };
        await addT(newTask)
        dispatch(addTask(newTask));
        setTask('');
    };

    const columns: ColumnsType<typeof tasks[0]> = [
        {
            title: t('title_table.check'),
            dataIndex: 'completed',
            key: 'completed',
            render: (_, record) => (
                <Checkbox
                    checked={record.completed}
                    onChange={() => dispatch(toggleTask(record.id))}
                />
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('title_table.name'),
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: t('title_table.action'),
            key: 'action',
            render: (_, record) => (
                <Button danger htmlType="button"  onClick={async () => {
                    const confirm = window.confirm(t('confirm_delete') || 'Xác nhận xóa?');
                    if (confirm) {
                        try {
                            console.log(record.id)
                            await deleteT(record.id); 
                            dispatch(deleteTask(record.id));
                            counter.current -= 1;
                        } catch {
                            alert(t('delete_failed') || 'Xóa thất bại!');
                        }
                    }
                }}>
                    {t('delete')}
                </Button>
            ),
        },
    ];

    const completedCount = tasks.filter(t => t.completed).length;
    const remainingCount = tasks.length - completedCount;

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-5 bg-white shadow-lg">

                <div className="p-10 flex">
                    <h1 className="text-2xl font-bold mb-4 mx-2">{t('title_add')}</h1>
                    <div className=" mb-6 ">
                        <Input
                            ref={inputRef}
                            placeholder={t('title_add')}
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            onPressEnter={handleAdd}
                            className="w-72 m-4"
                        />
                        <Button  className="mt-2 w-20" type="primary" htmlType="button" onClick={handleAdd}>{t('button_add')}</Button>
                    </div>
                </div>

                <h2 className="mt-8 mb-4 text-xl font-semibold">{t('title_list_task')}</h2>

                <Radio.Group
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                    value={filter}
                    className="mb-4"
                >
                    <Radio.Button value="all">{t('filter.all')}</Radio.Button>
                    <Radio.Button value="completed">{t('filter.completed')}</Radio.Button>
                    <Radio.Button value="pending">{t('filter.pending')}</Radio.Button>
                </Radio.Group>

                <Table dataSource={filteredTasks} columns={columns} pagination={{ pageSize: 15 }} rowKey="id" />


                <div className="mt-6 space-y-1 text-sm text-gray-700">
                    <p>{t('title_footer.total_task')}: {tasks.length}</p>
                    <p>{t('title_footer.task_done')}: {tasks.filter(t => t.completed).map(t => t.title).join(', ')}</p>
                    <p>{t('title_footer.number_task_done')}: {completedCount}</p>
                    <p>{t('title_footer.number_task_reject')}: {remainingCount}</p>
                </div>
            </div>
        </div>
    );
};

export default Task2;
