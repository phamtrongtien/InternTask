import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Table, Input, Button, Checkbox, Radio, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { addTask, toggleTask, deleteTask, setFilter, setTasks } from '../redux/taskSlice'; 
import { addT, deleteT, getT } from '../service/taskApi';

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  attachmentUrl: string;
}

const Task2: React.FC = () => {
  // MSAL Authentication
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = accounts && accounts.length > 0 ? accounts[0] : null;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { tasks, filter } = useSelector((state: RootState) => state.tasks);

  const [task, setTask] = useState('');
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<Input>(null);

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

  const getAccessToken = async (): Promise<string | null> => {
    if (!account) {
      alert("Không tìm thấy tài khoản đăng nhập.");
      return null;
    }
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          const response = await instance.acquireTokenPopup(loginRequest);
          return response.accessToken;
        } catch (popupError) {
          console.error("Acquire token popup error:", popupError);
          alert("Lấy token thất bại.");
          return null;
        }
      } else {
        console.error("Acquire token silent error:", error);
        alert("Lấy token thất bại.");
        return null;
      }
    }
  };

  const uploadFileToSP = async (file: File): Promise<string | null> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('accessToken', accessToken);

    try {
      const res = await fetch('http://localhost:3000/sharepoint/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errorText = await res.text();
        alert(`Upload lỗi: ${errorText}`);
        return null;
      }
      const data = await res.json();
      return data.webUrl || null;
    } catch (err) {
      alert("Upload thất bại.");
      console.error(err);
      return null;
    }
  };

  // Thêm task mới
  const handleAdd = async () => {
    if (task.trim() === '') {
      alert(t('alert'));
      return;
    }

    setUploading(true);

    let attachmentUrl: string = '';
    if (uploadingFile) {
      const url = await uploadFileToSP(uploadingFile);
      if (!url) {
        return;
      }
      attachmentUrl=url;
    }

    const newTask: Task = {
        id: (counter.current += 1).toString(),
        title: task.trim(),
        completed: false,
        attachmentUrl,
      };
      

    try {
      await addT(newTask);
      dispatch(addTask(newTask));
      setTask('');
      setUploadingFile(null);
      inputRef.current?.focus();
    } catch (error) {
      alert(t('add_failed') || "Thêm task thất bại");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Cấu hình các cột bảng
  const columns: ColumnsType<Task> = [
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
      title: t('title_table.attachment') || 'Đính kèm',
      dataIndex: 'attachmentUrl',
      key: 'attachmentUrl',
      render: (url: string | undefined) => url ? (
        <a href={url} download>
         Tải file
        </a>
      ) : (
        <span>Không có</span>
      ),
      
    },
    {
      title: t('title_table.action'),
      key: 'action',
      render: (_, record) => (
        <Button danger htmlType="button" onClick={async () => {
          const confirm = window.confirm(t('confirm_delete') || 'Xác nhận xóa?');
          if (confirm) {
            try {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-5">
      {!isAuthenticated ? (
        <button
          onClick={() => instance.loginPopup(loginRequest)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Đăng nhập SharePoint
        </button>
      ) : (
        <div className="p-5 bg-white shadow-lg w-full max-w-3xl">
          <div className="p-5 flex flex-col sm:flex-row items-center sm:items-start">
            <h1 className="text-2xl font-bold mb-4 sm:mb-0 sm:mr-4">{t('title_add')}</h1>
            <Input
              ref={inputRef}
              placeholder={t('title_add')}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onPressEnter={handleAdd}
              className="w-full sm:w-72 m-2"
            />
            <Upload 
              beforeUpload={file => {
                setUploadingFile(file);
                return false;
              }}
              className="m-2"
            >
              <Button icon={<UploadOutlined />}>Chọn file đính kèm</Button>
            </Upload>
            <Button 
              className="mt-2 sm:mt-0 sm:ml-2 w-32"
              type="primary"
              htmlType="button"
              loading={uploading}
              onClick={handleAdd}
            >
              {t('button_add')}
            </Button>
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

          <button
            className="mt-5 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => instance.logout()}
          >
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Task2;
