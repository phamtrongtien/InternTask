import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Table, Input, Button, Checkbox, Radio } from 'antd';
import type { ColumnsType } from 'antd/es/table';


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
      title: 'Hoàn thành',
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
      title: 'Công việc',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Hành động',
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
      <h1>Nhập công việc mới</h1>
      <Input
        ref={inputRef}
        placeholder="Nhập công việc"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onPressEnter={handleAdd}
        style={{ width: '300px', marginRight: '10px' }}
      />
      <Button type="primary" onClick={handleAdd}>Thêm</Button>

      <h1 style={{ marginTop: '30px' }}>DANH SÁCH CÔNG VIỆC</h1>

      <Radio.Group
        onChange={e => setFilter(e.target.value)}
        value={filter}
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="all">Tất cả</Radio.Button>
        <Radio.Button value="completed">Hoàn thành</Radio.Button>
        <Radio.Button value="pending">Chưa hoàn thành</Radio.Button>
      </Radio.Group>

      <Table dataSource={filteredTasks} columns={columns} pagination={false} rowKey="id" />

      <p>Tổng công việc: {taskList.length}</p>
      <p>
        Kế hoạch đã làm: {taskList
          .filter(item => item.completed)
          .map(item => item.title)
          .join(', ')}
      </p>

      <p>Công việc đã hoàn thành: {completedCount}</p>
      <p>Công việc còn lại: {remainingCount}</p>
    </div>
  );
};

export default Task1;
