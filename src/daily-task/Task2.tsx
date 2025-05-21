// src/components/Task2.tsx
import React, { useRef, useState, useMemo } from 'react';
import { Table, Input, Button, Checkbox, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { addTask, toggleTask, deleteTask, setFilter } from '../redux/taskSlice';

const Task2: React.FC = () => {
    const [task, setTask] = useState('');
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const { tasks, filter } = useSelector((state: RootState) => state.tasks);

    const filteredTasks = useMemo(() => {
        if (filter === 'completed') return tasks.filter(task => task.completed);
        if (filter === 'pending') return tasks.filter(task => !task.completed);
        return tasks;
    }, [tasks, filter]);

    const handleAdd = () => {
        if (task.trim() === '') {
            alert(t('alert'));
            return;
        }
        dispatch(addTask(task.trim()));
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
                <Button danger onClick={() => {
                    const confirm = window.confirm(t('confirm_delete') || 'Xác nhận xóa?');
                    if (confirm) dispatch(deleteTask(record.id));
                }}>
                    Xóa
                </Button>
            ),
        },
    ];

    const completedCount = tasks.filter(t => t.completed).length;
    const remainingCount = tasks.length - completedCount;

    const changeLanguage = (lng: 'en' | 'vn') => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="m-10" style={{ padding: '20px' }}>
            <Button onClick={() => changeLanguage('vn')}>Tiếng Việt</Button>
            <Button onClick={() => changeLanguage('en')} style={{ marginLeft: 10 }}>English</Button>

            <div className='p-10'>
                <h1>{t('title_add')}</h1>
                <Input
                    ref={inputRef}
                    placeholder={t('title_add')}
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onPressEnter={handleAdd}
                    style={{ width: 300, marginRight: 10 }}
                />
                <Button type="primary" onClick={handleAdd}>{t('button_add')}</Button>

            </div>
            <h2 style={{ marginTop: 30 }}>{t('title_list_task')}</h2>

            <Radio.Group
                onChange={(e) => dispatch(setFilter(e.target.value))}
                value={filter}
                style={{ marginBottom: 16 }}
            >
                <Radio.Button value="all">{t('filter.all')}</Radio.Button>
                <Radio.Button value="completed">{t('filter.completed')}</Radio.Button>
                <Radio.Button value="pending">{t('filter.pending')}</Radio.Button>
            </Radio.Group>

            <Table dataSource={filteredTasks} columns={columns} pagination={false} rowKey="id" />

            <p>{t('title_footer.total_task')}: {tasks.length}</p>
            <p>{t('title_footer.task_done')}: {tasks.filter(t => t.completed).map(t => t.title).join(', ')}</p>
            <p>{t('title_footer.number_task_done')}: {completedCount}</p>
            <p>{t('title_footer.number_task_reject')}: {remainingCount}</p>
        </div>
    );
};

export default Task2;
