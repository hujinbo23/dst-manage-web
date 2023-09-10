/* eslint-disable react/prop-types */
import {useEffect, useState} from 'react';
import _ from 'lodash';
import {Modal, Button, Space, Form, Typography, Divider, message, Popconfirm, Spin} from 'antd';
import Select2 from './Select2';
import {timestampToString} from "../../../utils/dateUitls";
import {updateModApi} from "../../../api/modApi";

const {Paragraph} = Typography;

const OptionSelect = ({mod, root, setRoot, defaultValues, defaultValuesMap, setDefaultValuesMap}) => {

    const [form] = Form.useForm();
    useEffect(() => {
        const options = mod.mod_config.configuration_options;
        if (options !== undefined && options !== null) {
            const object = {};
            options.forEach((item) => {
                const {name} = item;
                const value = item.default;
                object[name] = value;
            });
            const newDefault = {};
            options.forEach((o) => {
                newDefault[o.name] = o.default;
            });
            // setDefaultValue(newDefault);
            //   console.log('init', options,object);
        }
    }, []);

    // eslint-disable-next-line no-unused-vars
    const handleFormChange = (changedValues, allValues) => {
        // console.log('Changed values:', changedValues);
        // eslint-disable-next-line no-restricted-syntax
        for (const fieldName in changedValues) {
            // eslint-disable-next-line no-prototype-builtins
            if (changedValues.hasOwnProperty(fieldName)) {
                const fieldValue = changedValues[fieldName];
                // console.log(`Field ${fieldName} changed to ${fieldValue}`);
                _.set(root, `${mod.modid}.${fieldName}`, fieldValue);

                // 同时把 默认的配置 也更新下
                const newDefaultValue = _.cloneDeep(defaultValuesMap)
                // _.set(newDefaultValue, `"${mod.modid}".${fieldName}`, fieldValue)
                console.log("newDefaultValue.get(mod.modid): ", newDefaultValue.get(mod.modid))
                if (newDefaultValue.get(mod.modid) === undefined || newDefaultValue.get(mod.modid) === null) {
                    const obj = {
                        fieldName: fieldValue
                    }
                    newDefaultValue.set(mod.modid, obj)
                } else {
                    newDefaultValue.get(mod.modid)[`${fieldName}`] = fieldValue
                }
                setDefaultValuesMap(newDefaultValue)

                console.log("defaultValuesMap: ", defaultValuesMap)
                console.log("newDefaultValue: ", newDefaultValue)
            }
        }
        const _root = _.cloneDeep(root);
        setRoot(_root);
    };

    return (
        <>
            <Form
                form={form}
                onValuesChange={handleFormChange}
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
            >
                {mod.mod_config.configuration_options !== undefined &&
                    mod.mod_config.configuration_options
                        .filter((item) => item.options !== undefined)
                        .map((item) =>
                                // eslint-disable-next-line react/jsx-key
                            {
                                // 例如2928810007,2334209327都是这样的,options只有一个,而且就只是默认值,并且该项的description没有内容
                                if (item.options.length === 1 && item.options[0].data === item.default && !item.options[0].description) {
                                    /*                           在DST中,如果label为空字符串,就直接是显示空白行,这里用||会导致label为空也显示name,为了跟DST保持一样使用了??
                                                                                                                                     ↓                     */
                                    return <Divider key={item.label}><span style={{fontSize: "14px", fontWeight: "600"}}>{item.label ?? item.name}</span></Divider>
                                }
                                // TODO 还不知道哪些mod是这样的作为标题的,我目前没有发现
                                if (item.name === 'Title' || item.name === '') {
                                    if (item.label === '') {
                                        return ""
                                    }
                                    return <Divider key={item.label} ><span style={{fontSize: "14px", fontWeight: "600"}}>{item.label} 配置</span></Divider>
                                    // return <h4 key={item.label}>{item.label} 配置</h4>;
                                }

                                let defaultValue
                                if (defaultValuesMap.get(`${mod.modid}`) !== undefined) {
                                    defaultValue = defaultValuesMap.get(`${mod.modid}`)[`${item.name}`]
                                } else {
                                    defaultValue = undefined
                                }
                                // console.log("1111111: ",defaultValuesMap, mod.modid, defaultValuesMap.get(`${mod.modid}`), item.name)
                                return <Select2 key={item.name+defaultValue} item={item}
                                                defaultValue={defaultValue}/>;
                            }
                        )}
            </Form>
        </>
    );
};

// eslint-disable-next-line react/prop-types
const ModDetail = ({mod, setMod, setModList, root, setRoot, defaultValues, defaultValuesMap, setDefaultValuesMap}) => {

    const [open, setOpen] = useState(false);
    const [ellipsis, setEllipsis] = useState(true);
    const [spinning,setSpinning] = useState(false)

    function updateMod() {
        setSpinning(true)
        updateModApi("", mod.modid)
            .then(resp=>{
                if (resp.code === 200) {
                    const newMod = resp.data
                    newMod.installed = true
                    setModList(current=>{
                        let index = 0;
                        // eslint-disable-next-line no-plusplus
                        for (let i = 0; i < current.length; i++) {
                            if (current[i].modid === newMod.modid) {
                                index = i
                                if (current.enable) {
                                    newMod.enable = true
                                }
                            }
                        }
                        current[index] = newMod
                        console.log(current)
                        return [...current]
                    })
                    setMod(newMod)
                    setSpinning(false)
                    message.success("更新成功")
                }
            })
    }

    return (
        <div
            style={{
                height: '370px',
                overflowY: 'auto',
                overflowX: 'auto',
            }}
        >
            {mod.installed && <>
                <Spin spinning={spinning} tip={"正在更新模组"} >
                <Space size={16} wrap>
                    <img alt="example" src={mod.img}/>
                    <div>
                            <span style={{
                                fontSize: '16px',
                                fontWeight: 500
                            }}>{mod.name}</span>
                        <br/>
                        <span>模组id:{mod.modid}</span>
                        <br/>
                        <span>作者: {mod.mod_config.author}</span>
                    </div>
                    <div>
                        <span>版本: {mod.mod_config.version}</span>
                        <div>最后更新时间: {timestampToString(mod.last_time* 1000)}</div>
                        <span>{mod.mod_config.dont_starve_compatible === true && <span>饥荒联机版兼容</span>}</span>
                        <span>{mod.mod_config.dont_starve_compatible === false && <span>-</span>}</span>
                    </div>
                </Space>
                <div>
                    <br/>
                    <Paragraph
                        getContainer={false}
                        ellipsis={
                            ellipsis
                                ? {
                                    rows: 2,
                                    expandable: true,
                                    symbol: 'more',
                                }
                                : false
                        }
                    >
                        {mod.mod_config.description}
                    </Paragraph>

                    <br/>

                </div>
                <Space>
                    <Button type="primary" onClick={() => setOpen(true)}>
                        配置
                    </Button>
                    <Button>
                        <a
                            target={'_blank'}
                            href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.modid}`}
                            rel="noreferrer"
                        >
                            创意工坊
                        </a>
                    </Button>
                    <Popconfirm
                        title="是否更新mod"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={()=>updateMod()}
                    >
                        <Button type="primary" >
                            更新
                        </Button>
                    </Popconfirm>
                </Space>

                <Modal
                    getContainer={document.body}
                    title={`${mod.name} 配置`}
                    // centered
                    open={open}
                    onOk={() => {
                        setOpen(false);
                    }}
                    onCancel={() => setOpen(false)}
                    width={640}
                    destroyOnClose
                >
                    <div style={{
                        height: '386px',
                        overflowY: 'auto',
                        overflowX: 'auto'
                    }}>
                        {mod.mod_config.configuration_options !== undefined && (
                            <OptionSelect mod={mod} root={root} setRoot={setRoot} defaultValues={defaultValues}
                                          defaultValuesMap={defaultValuesMap}
                                          setDefaultValuesMap={setDefaultValuesMap}
                            />
                        )}
                        {mod.mod_config.configuration_options === undefined &&<>
                            <br/>
                            <br/>
                            <span>暂无配置。请注意有可能网络问题，导致配置获取不到请求请删除模组重新订阅</span>
                        </>}
                    </div>

                </Modal>
                </Spin>
            </>}
            {!mod.installed && <>
                <span>暂无模组，请先订阅</span>
            </>}

        </div>
    );
};

export default ModDetail;
