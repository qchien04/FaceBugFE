const API_DOMAIN="http://localhost:3002/";



export const get =async(path:string)=>{
    const response=await fetch(API_DOMAIN+path);
    const result=await response.json();
    return result;
}



export const post=async(path:string,option:unknown)=>{
    const response=await fetch(API_DOMAIN+path,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-type":"application/json",
        },
        body:JSON.stringify(option),
    });
    const result=await response.json();
    return result;
}

export const del=async(path:string,id:string)=>{
    const response=await fetch(`${API_DOMAIN}${path}/${id}`,{
        method:"DELETE",
    });
    const result=await response.json();
    return result;
}

export const patch=async(path:string,option:unknown)=>{
    const response=await fetch(API_DOMAIN+path,{
        method:"PATCH",
        headers:{
            Accept:"application/json",
            "Content-type":"application/json",
        },
        body:JSON.stringify(option),
    });
    const result=await response.json();
    return result;
}

export const getTimeAgo = (time: string): string => {
    const startTime = new Date(time);   
    const now = new Date(); 
    
    const timeDiffMs = now.getTime() - startTime.getTime();
    const timeDiffMinutes = Math.floor(timeDiffMs / 60000);

    if (timeDiffMinutes < 1) return "Vừa xong";
    if (timeDiffMinutes < 60) return `${timeDiffMinutes} phút trước`;

    const timeDiffHours = Math.floor(timeDiffMinutes / 60);
    if (timeDiffHours < 24) return `${timeDiffHours} giờ trước`;

    const timeDiffDays = Math.floor(timeDiffHours / 24);
    if (timeDiffDays < 7) return `${timeDiffDays} ngày trước`;

    const timeDiffWeeks = Math.floor(timeDiffDays / 7);
    if (timeDiffWeeks < 4) return `${timeDiffWeeks} tuần trước`;

    const timeDiffMonths = Math.floor(timeDiffWeeks / 4);
    return `${timeDiffMonths} tháng trước`;
};

export const linkify = (text:string) => {
    const urlRegex = /(http?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      ) : (
        part
      )
    );
  };