import myAxios from "../../plugins/myAxios.js";

// 条件搜索
export function searchResumePageRequest(resume) {
    return myAxios.get('/company/note', {
        params: resume
    })
}

export function getResumeByIdRequest(noteId){
    return myAxios.get('/company/note/detail', {
        params: {
            noteId
        }
    })
}

export function passCurrentResumeRequest(noteId){
    return myAxios.post('/company/note', {
        noteId
    })
}

