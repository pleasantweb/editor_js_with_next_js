import React, { useEffect, useRef} from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import LinkTool from '@editorjs/link';
import RawTool from '@editorjs/raw';
// import SimpleImage from '@editorjs/simple-image';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import { StyleInlineTool } from 'editorjs-style';
import Tooltip from 'editorjs-tooltip';
import { CloudImage } from './UploadImage/CloudImage';
import _ from 'lodash/debounce'


type propType={
  setContent:React.Dispatch<React.SetStateAction<string>>,
  content:string
}

const DEFAULT_INITIAL_DATA = () => {
    return {
      "time": new Date().getTime(),
      "blocks": [
        {
          "type": "paragraph",
          "data": {
            "text": "Start writing here !!!",
            "level": 1
          }
        },
      ]
    }
  }
const EDITTOR_HOLDER_ID = 'editorjs';

const CustomEditor = (props:propType) => {

    const {setContent,content} = props

    const isInstance = useRef<EditorJS|null>(null)

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

     // save images in Cloudinary
     
const onFileChange=async(file:File)=>{

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
        return 'nahi hai image' // <-- put an error image url here
      }
  }

return ' nahi hai hai image' // <-- put an error image url here
}

//////////////////////////////////////////////////////////////////////////////////
    const initEditor = () => {
        const editor = new EditorJS({
          holder: EDITTOR_HOLDER_ID,
          data: content === '' ? (DEFAULT_INITIAL_DATA()) :(JSON.parse(content)),
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
           
           
            header: {
              class: Header,
              inlineToolbar: true,
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
            code: {
              class:CodeTool,
              inlineToolbar: true,
            }
          },


        });
       async function contents(){
         const output = await editor.save()
         const content = JSON.stringify(output)
         setContent(content) 
    
        }
      };
     
      
    return (
      <>
    <div className='Editor_class' >
         <div id={EDITTOR_HOLDER_ID}> </div>
    </div>
   
    </>
  )
}

export default CustomEditor;