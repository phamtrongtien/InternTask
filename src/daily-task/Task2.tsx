import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Table, Input, Button, Checkbox, Radio, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { addTask, toggleTask, deleteTask, setFilter, setTasks } from '../redux/taskSlice';
import { addT, addTaskApi, deleteT, getT } from '../service/taskApi';

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

import type { UploadFile } from 'antd/es/upload/interface';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  attachmentUrl: string[];
}

const Task2: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = accounts && accounts.length > 0 ? accounts[0] : null;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { tasks, filter } = useSelector((state: RootState) => state.tasks);

  const [task, setTask] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const [load, setLoad] = useState(false);


  useEffect(() => {
    async function fetchTasks() {
      try {
        const data : Task[] = await getT();
        dispatch(setTasks(data));

      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    }
    fetchTasks();
  }, [dispatch,load]);

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
  const handleLogout = () => {
    instance.logoutPopup().catch((error) => {
      console.error("Logout error:", error);
    });
  };
  // Upload nhiều file, trả về mảng url
  const uploadFilesToSP = async (files: UploadFile[]): Promise<string[] | null> => {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const urls: string[] = [];

    for (const file of files) {
      if (!file.originFileObj) continue;
      const formData = new FormData();
      formData.append('file', file.originFileObj);
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

        const data = await res.json(); // data là mảng UploadResult[]
        console.log(data);
        data.forEach((item: any) => {
          if (item.success && item.data && item.data.webUrl) {
            urls.push(item.data.webUrl);
          }
        });

      } catch (err) {
        alert("Upload thất bại.");
        console.error(err);
        return null;
      }
    }

    return urls;
  };


  // Thêm task mới
  const handleAdd = async () => {
    if (task.trim() === '') {
      alert(t('alert'));
      return;
    }
  
    setUploading(true);
  
    let attachmentUrls: string[] = [];
  
    if (uploadingFiles.length > 0) {
      const urls = await uploadFilesToSP(uploadingFiles);
      if (!urls) {
        setUploading(false);
        return;
      }
      attachmentUrls = urls;
    }
  
    const newTask = {
      title: task.trim(),
      completed: false,
      attachmentUrl: attachmentUrls,
    };
  
    try {
      // Gọi API POST NestJS
      const savedTask = await addTaskApi(newTask);
  
      // Cập nhật redux store với task có id từ DB (nếu backend trả về id)
      dispatch(addTask(savedTask));
  
      setTask('');
      setUploadingFiles([]);
    } catch (error) {
      alert(t('add_failed') || "Thêm task thất bại");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  
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
      render: (urls?: string[]) => {
        if (!Array.isArray(urls) || urls.length === 0) {
          return <span>Không có</span>;
        }
        return (
          <>
            {urls.map((url, idx) => (
              <div key={idx}>
                <a href={url} download target="_blank" rel="noopener noreferrer">
                  Tải file {idx + 1}
                </a>
              </div>
            ))}
          </>
        );
      },
    }
    ,
    {
      title: t('title_table.action'),
      key: 'action',
      render: (_, record) => (
        <Button danger htmlType="button" onClick={async () => {
          console.log("🧩 ID của task:", record.id); 
          const confirm = window.confirm(t('confirm_delete') || 'Xác nhận xóa?');
          if (confirm) {
            try {
              await deleteT(record.id);
              dispatch(deleteTask(record.id));
              setLoad(!load)
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
              multiple
              beforeUpload={file => {
                const newFile: UploadFile = {
                  uid: file.uid || `${Date.now()}-${file.name}`,
                  name: file.name,
                  status: 'done',
                  size: file.size,
                  type: file.type,
                  originFileObj: file,
                };
                setUploadingFiles(prev => [...prev, newFile]);
                return false; // ngăn upload tự động
              }}
              onRemove={file => {
                setUploadingFiles(prev => prev.filter(f => f.uid !== file.uid));
              }}
              fileList={uploadingFiles}
              className="m-2"
            >
                <Button icon={<UploadOutlined />}>{ t('button_add_file')}</Button>
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
            className="mb-3"
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
            options={[
              { label: t('filter.all'), value: 'all' },
              { label: t('filter.completed'), value: 'completed' },
              { label: t('filter.pending'), value: 'pending' },
            ]}
            optionType="button"
            buttonStyle="solid"
          />

          <Table
            dataSource={filteredTasks}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>{t('completed')}: {completedCount}</span>
            <span>{t('remaining')}: {remainingCount}</span>
            </div>
            <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-4"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default Task2;
