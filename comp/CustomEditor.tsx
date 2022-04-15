import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import LinkTool from '@editorjs/link';
import RawTool from '@editorjs/raw';
import SimpleImage from '@editorjs/simple-image';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import EditorJSStyle,{ StyleInlineTool } from 'editorjs-style';
import Tooltip from 'editorjs-tooltip';
import { CloudImage } from './UploadImage/CloudImage';
import _ from 'lodash/debounce'

const DEFAULT_INITIAL_DATA = () => {
    return {
      "time": new Date().getTime(),
      "blocks": [
        {
          "type": "paragraph",
          "data": {
            "text": "This is my awesome editor!",
            "level": 1
          }
        },
      ]
    }
  }
const EDITTOR_HOLDER_ID = 'editorjs';

const CustomEditor = () => {
    const isInstance = useRef<EditorJS|null>(null)
    const [editorData, setEditorData] = useState<string>()

/////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (!isInstance.current) {
          initEditor();
    }
        return () => {
            if(isInstance.current){
             isInstance.current.destroy()
             isInstance.current = null;
            }
        }
      }, []);
//////////////////////////////////////////////////////////////////////////////
const onFileChange=async(file:File)=>{
console.log(file);

  // let files : FileList | null = e.currentTarget.files
  const form_data = new FormData()
  let preset = process.env.NEXT_PUBLIC_PRESET
  if(preset){
   form_data.append('upload_preset',preset)
  }
  if(file){
          form_data.append('file',file)
         const imageUrl =await CloudImage(form_data)

       if(imageUrl){
         console.log(imageUrl);
         
          return imageUrl
      }else{
        return 'nahi hai image'
      }
  }
// }
return ' nahi hai hai image'
}
// console.log('yo');
// var debounce_fun = _(function () {
//   console.log('Function debounced after 1000ms!');
//   }, 1000);
  
// debounce_fun();
//////////////////////////////////////////////////////////////////////////////////
    const initEditor = () => {
        const editor = new EditorJS({
          holder: EDITTOR_HOLDER_ID,
        //   logLevel: "ERROR",
        //   data: editorData,
          onReady: () => {
            isInstance.current = editor
          },
          onChange: _(function() {
            try{
              contents()
            }catch(err){
              
            }
            
          },3000),
          autofocus: true,
          tools:{
            style: StyleInlineTool,
            tooltip: {
              class: Tooltip,
              config: {
                location: 'left',
                highlightColor: '#FFEFD5',
                underline: true,
                backgroundColor: '#154360',
                textColor: '#FDFEFE',
                holder: 'editorId',
              }
            },
            // header:Header,
           
            header: {
              class: Header,
              config: {
                defaultLevel: 1
              }
            },
           
            raw: RawTool,
            linkTool: LinkTool,
            image:{
              class:ImageTool,
              config: {
                uploader: {
                 async uploadByFile(file:File){
                    return onFileChange(file).then((imageUrl)=>{
                      return {
                      success:1,
                      file:{
                        url:imageUrl
                      }
                      }
                    }
                    )
                  }
                }
              }
            },



            checklist: {
              class: Checklist,
              inlineToolbar: true,
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              }
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+O',
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author',
              },
            },
            code: CodeTool,
          },


        });
       async function contents(){
         const output = await editor.save()
         const content = JSON.stringify(output)
         setEditorData(content) 
    
        }
      };
      console.log(editorData);
      
    return (
      <>
    <div className='Editor_class' >
         <div id={EDITTOR_HOLDER_ID}> </div>
    </div>
    <button onClick={()=>console.log(editorData)
    } className='save_btn'>Save</button>
    </>
  )
}

export default CustomEditor;