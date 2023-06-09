import { Button, Popconfirm, message } from 'antd';
import { useState } from 'react';
import { cleanWorldApi } from '../../../api/gameApi';

const CleanArchive = () => {

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const showPopconfirm = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setConfirmLoading(true);

        setTimeout(() => {
            cleanWorldApi()
                .then(data => {
                    setOpen(false);
                    setConfirmLoading(false);
                    message.success("清理成功")
                }).catch(error => {
                    setOpen(false);
                    setConfirmLoading(false);
                    message.error("清理失败")
                })
        }, 2000);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <Popconfirm
            title="是否清理"
            description="清理后将丢失数据，请做好备份"
            open={open}
            onConfirm={handleOk}
            okButtonProps={{
                loading: confirmLoading,
            }}
            onCancel={handleCancel}
        >
            <Button type="primary" danger
                onClick={showPopconfirm}
            >清理存档</Button>
        </Popconfirm>
    )
}

export default CleanArchive