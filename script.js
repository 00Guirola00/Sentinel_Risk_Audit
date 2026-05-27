const Engine = {
    rotate(v, rx, ry, rz){
        let [x,y,z] = v;
        let x1 = x * Math.cos(ry) + z * Math.sin(ry);
        let z1 = -x * Math.sin(ry) + z * Math.cos(ry);
        let y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
        let z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
        let x3 = x1 * Math.cos(rz) - y2 * Math.sin(rz);
        let y3 = x1 * Math.sin(rz) + y2 * Math.cos(rz);
        return [x3,y3,z2];
    },
    project(v){
        const fov = 600;
        const scale = 260;
        const d = fov / (fov + v[2]);
        return [
            innerWidth/2 + v[0]*scale*d,
            innerHeight/2 + v[1]*scale*d,
            d
        ];
    }
};

const Scene = {
    particles:[], wires:[], rings:[], hex:[],
    init(){
        const chars = "01∞∆ΩΨΣΞλ<>[]{}#";
        for(let i=0;i<420;i++){
            const phi = Math.random()*Math.PI*2;
            const theta = Math.random()*Math.PI-Math.PI/2;
            const radius = 1.2 + Math.sin(i)*0.05;
            this.particles.push({
                pos:[radius*Math.cos(theta)*Math.cos(phi), radius*Math.sin(theta), radius*Math.cos(theta)*Math.sin(phi)],
                char:chars[Math.floor(Math.random()*chars.length)],
                color:["#00fff0","#00ff88","#7d5cff","#ff0088","#ffffff"][Math.floor(Math.random()*5)]
            });
        }
        for(let r=0;r<7;r++){
            let layer = [];
            for(let i=0;i<80;i++){
                let a = i*Math.PI*2/80;
                let radius = 1.6 + r*0.16;
                layer.push([Math.cos(a)*radius, Math.sin(a)*radius*0.35, Math.sin(a*4)*0.15]);
            }
            this.rings.push(layer);
        }
        for(let i=0;i<220;i++){
            let a = i*0.22;
            this.wires.push({pos:[Math.cos(a)*0.55, (i-110)/75, Math.sin(a)*0.55]});
            this.wires.push({pos:[Math.cos(a+Math.PI)*0.55, (i-110)/75, Math.sin(a+Math.PI)*0.55]});
        }
        for(let y=-1.5;y<=1.5;y+=0.5){
            let layer=[];
            for(let i=0;i<6;i++){
                let a = i*Math.PI/3;
                layer.push([Math.cos(a)*2, y, Math.sin(a)*2]);
            }
            this.hex.push(layer);
        }
    }
};

const svg = document.getElementById("scene");

function drawLine(x1,y1,x2,y2,color,cls="mesh"){
    let line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1",x1); line.setAttribute("y1",y1);
    line.setAttribute("x2",x2); line.setAttribute("y2",y2);
    line.setAttribute("stroke",color); line.setAttribute("class",cls+" glow");
    svg.appendChild(line);
}

function loop(){
    svg.innerHTML = svg.querySelector("defs").outerHTML;
    const t = Date.now()*0.001;
    const rx = t*0.45, ry = t*0.28, rz = t*0.15;

    for(let x=0;x<innerWidth;x+=60){ drawLine(x,0,x,innerHeight,"rgba(0,255,255,.05)"); }
    for(let y=0;y<innerHeight;y+=60){ drawLine(0,y,innerWidth,y,"rgba(255,0,150,.05)"); }

    Scene.rings.forEach((ring,idx)=>{
        for(let i=0;i<ring.length;i++){
            const p1 = Engine.rotate(ring[i], rx+(idx*0.1), ry-(idx*0.1), rz);
            const p2 = Engine.rotate(ring[(i+1)%ring.length], rx+(idx*0.1), ry-(idx*0.1), rz);
            const A = Engine.project(p1); const B = Engine.project(p2);
            drawLine(A[0],A[1],B[0],B[1], idx%2===0 ? "#00fff0" : "#ff0088", "ring");
        }
    });

    Scene.hex.forEach(layer=>{
        let projected=[];
        layer.forEach(p=>{ projected.push(Engine.project(Engine.rotate(p,rx*0.6,ry*0.6,rz*0.2))); });
        for(let i=0;i<projected.length;i++){
            let A = projected[i]; let B = projected[(i+1)%projected.length];
            drawLine(A[0],A[1],B[0],B[1], "#7d5cff", "hex");
        }
    });

    let helixProjected=[];
    Scene.wires.forEach(w=>{ helixProjected.push(Engine.project(Engine.rotate(w.pos,rx*1.2,ry*1.1,rz))); });
    for(let i=0;i<helixProjected.length-2;i+=2){
        let A = helixProjected[i]; let B = helixProjected[i+1];
        drawLine(A[0],A[1],B[0],B[1], "#00ff88", "energy");
    }

    let projected = Scene.particles.map(p=>{
        let pulse = 1 + Math.sin(t*2 + p.pos[0]*4)*0.08;
        let pos = [p.pos[0]*pulse, p.pos[1]*pulse, p.pos[2]*pulse];
        let rot = Engine.rotate(pos,rx,ry,rz);
        let proj = Engine.project(rot);
        return {x:proj[0], y:proj[1], d:proj[2], z:rot[2], char:p.char, color:p.color};
    }).sort((a,b)=>a.z-b.z);

    for(let i=0;i<projected.length;i++){
        for(let j=i+1;j<projected.length;j++){
            let dx = projected[i].x - projected[j].x, dy = projected[i].y - projected[j].y;
            if(Math.sqrt(dx*dx+dy*dy)<75){ drawLine(projected[i].x,projected[i].y,projected[j].x,projected[j].y,projected[i].color); }
        }
    }

    projected.forEach(p=>{
        let txt = document.createElementNS("http://www.w3.org/2000/svg","text");
        txt.setAttribute("x",p.x); txt.setAttribute("y",p.y);
        txt.setAttribute("fill",p.color); txt.setAttribute("class","matrix glow");
        txt.setAttribute("font-size",10 + p.d*8);
        txt.textContent = p.char;
        svg.appendChild(txt);
    });

    for(let i=0;i<18;i++){
        let left = document.createElementNS("http://www.w3.org/2000/svg","text");
        left.setAttribute("x",40); left.setAttribute("y",80 + i*28);
        left.setAttribute("fill",i%2===0 ? "#00fff0" : "#00ff88"); left.setAttribute("class","side glow");
        left.textContent = "CORE_" + Math.random().toString(16).slice(2,8).toUpperCase();
        svg.appendChild(left);
        let right = document.createElementNS("http://www.w3.org/2000/svg","text");
        right.setAttribute("x",innerWidth - 240); right.setAttribute("y",80 + i*28);
        right.setAttribute("fill",i%2===0 ? "#ff0088" : "#7d5cff"); right.setAttribute("class","side glow");
        right.textContent = "QUANTUM_NODE_" + Math.floor(Math.random()*9999);
        svg.appendChild(right);
    }

    let title = document.createElementNS("http://www.w3.org/2000/svg","text");
    title.setAttribute("x",innerWidth/2); title.setAttribute("y",innerHeight - 90);
    title.setAttribute("fill","url(#grad1)"); title.setAttribute("class","coreText glow");
    title.textContent = "NEURAL CORE ∞ ENTITY";
    svg.appendChild(title);

    let subtitle = document.createElementNS("http://www.w3.org/2000/svg","text");
    subtitle.setAttribute("x",innerWidth/2); subtitle.setAttribute("y",innerHeight - 55);
    subtitle.setAttribute("fill","#00fff0"); subtitle.setAttribute("class","smallCore glow");
    subtitle.textContent = "SYNTHETIC CONSCIOUSNESS // DIMENSIONAL NETWORK";
    svg.appendChild(subtitle);

    let core = document.createElementNS("http://www.w3.org/2000/svg","circle");
    core.setAttribute("cx",innerWidth/2); core.setAttribute("cy",innerHeight/2);
    core.setAttribute("r",18 + Math.sin(t*4)*4); core.setAttribute("fill","url(#grad2)");
    core.setAttribute("opacity",".9"); core.setAttribute("class","glow");
    svg.appendChild(core);

    requestAnimationFrame(loop);
}

Scene.init();
loop();