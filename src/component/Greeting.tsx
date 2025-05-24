import { Button, message, Upload } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

const Greeting: React.FC = () => {
  const [hello, setHello] = useState('');
  const props = {
    name: 'file',
    action: 'http://localhost:3000/api/upload', // API backend upload file
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleFetchHello = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/hello`);
      return res.data;

    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      return "";
    }
  };

    const fetchData = async () => {
      const data = await handleFetchHello();
      setHello(data);
    };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Button onClick={fetchData}>Nhấp để hiện</Button>
      <h1>{hello ? hello : "Loading..."}</h1>
      <Upload {...props}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
    </div>
  );
};

export default Greeting;
