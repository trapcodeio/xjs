class A  {
    classA(){
        console.log("from classA")
    }
}

function extendClass(RequestEngine) {
    return class extends RequestEngine {
        classA(){
            console.log("from Extended class A")
        }
    }
}

const C =  extendClass(A);
console.log((new  C).classA());
process.exit();