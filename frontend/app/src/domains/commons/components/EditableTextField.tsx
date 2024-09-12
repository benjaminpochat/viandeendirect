import { CancelOutlined, CheckOutlined, EditOutlined } from "@mui/icons-material";
import { Stack, TextField } from "@mui/material";
import React, { useState } from "react";

export default function EditableTextField({ 
    initialValue, 
    validateCallback, 
    label, 
    editable: initialEditable,
    toggleCallback}) {

    const [editable, setEditable] = useState<boolean>(initialEditable)
    const [writable, setWritable] = useState<boolean>(false)
    const [value, setValue] = useState<string>(initialValue)

    function getActions(): React.ReactNode {
        if(!initialEditable) {
            return <></>
        }
        if (writable) {
            return  <>
                <CheckOutlined 
                    onClick={() => validate()} 
                    sx={{
                    ":hover": {
                        cursor: 'pointer'
                        }
                    }}/>
                <CancelOutlined 
                    onClick={() => cancel()} 
                    sx={{
                        ":hover": {
                            cursor: 'pointer'
                            }
                        }}/>
            </>
        }
        return <EditOutlined 
                    onClick={() => edit()} 
                    sx={{
                        ":hover": {
                            cursor: 'pointer'
                            }
                        }}
                />
    }

    return <Stack alignItems="center" direction="row" gap={2}>
        <TextField
            label={label}
            defaultValue={value}
            variant="standard"
            InputProps={{ readOnly: !writable }}
            disabled={!writable && !(value?.length > 0)}
            onChange={(event) => setValue(event.target.value)}
            
            fullWidth
        />
        {getActions()}
    </Stack>


    function edit(): void {
        setWritable(true);
        toggleCallback()
    }

    function cancel(): void {
        setWritable(false)
        setValue(initialValue)
        toggleCallback()
    }

    async function validate(): Promise<void> {
        await validateCallback(value)
        setWritable(false)
        toggleCallback()
    }
}