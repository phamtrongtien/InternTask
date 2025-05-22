import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Table, Input, Button, Checkbox, Radio } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';


interface Task {
  id: string;
  title: string;
  completed: boolean;
}


const Task1: React.FC = () => {
  const [task, setTask] = useState<string>('');
  const [taskList, setTaskList] = useState<Task[]>([
    { id: 'todo-1', title: 'Ly tuyet', completed: false },
    { id: 'todo-2', title: 'Baitap1', completed: false },
  ]);
  const { t } = useTranslation();
  const inputRef = useRef<null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const idCounter = useRef<number>(0);
  idCounter.current = taskList.length;


  const handleAdd = useCallback(() => {
    if (task.trim() === '') {
      alert('Vui lòng nhập công việc!');
      return;
    }
    idCounter.current += 1;
    const newTask: Task = {
      id: 'todo-' + idCounter.current,
      title: task.trim(),
      completed: false,
    };
    setTaskList(prev => [...prev, newTask]);
    setTask('');

  }, [task]);

  const toggleItem = useCallback((id: string) => {
    setTaskList(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    const isConfirmed = window.confirm('Bạn thật sự muốn xóa công việc này?');
    if (!isConfirmed) return;
    setTaskList(prev => prev.filter(task => task.id !== id));
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === 'completed') {
      return taskList.filter(item => item.completed);
    }
    if (filter === 'pending') {
      return taskList.filter(item => !item.completed);
    }
    return taskList;
  }, [taskList, filter]);


  const columns: ColumnsType<Task> = [
    {
      title: t('title_table.check'),
      dataIndex: 'completed',
      key: 'completed',
      render: (_, record) => (
        <Checkbox checked={record.completed} onChange={() => toggleItem(record.id)} />
      ),
    },
    {
      title: 'id',
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
      dataIndex: 'completed',
      key: 'action',
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  const completedCount = useMemo(() => {
    return taskList.filter(item => item.completed).length;
  }, [taskList]);

  const remainingCount = useMemo(() => {
    return taskList.filter(item => !item.completed).length;
  }, [taskList]);

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-2xl font-bold mb-4">{t('title_add')}</h1>

      <Input
        ref={inputRef}
        placeholder={t('title_add')}
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onPressEnter={handleAdd}
        style={{ width: '300px', marginRight: '10px' }}
      />
      <Button type="primary" onClick={handleAdd}>{t('button_add')}</Button>

      <h1 style={{ marginTop: '30px' }}>{t('title_list_task')}</h1>

      <Radio.Group
        onChange={e => setFilter(e.target.value)}
        value={filter}
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="all">{t('filter.all')}</Radio.Button>
        <Radio.Button value="completed">{t('filter.completed')}</Radio.Button>
        <Radio.Button value="pending">{t('filter.pending')}</Radio.Button>
      </Radio.Group>

      <Table dataSource={filteredTasks} columns={columns} pagination={false} rowKey="id" />

      <p>{t('title_footer.total_task')}: {taskList.length}</p>
      <p>
        {t('title_footer.task_done')}: {taskList
          .filter(item => item.completed)
          .map(item => item.title)
          .join(', ')}
      </p>

      <p>{t('title_footer.number_task_done')}: {completedCount}</p>
      <p>{t('title_footer.number_task_reject')}: {remainingCount}</p>
    </div>
  );
};

export default Task1;
