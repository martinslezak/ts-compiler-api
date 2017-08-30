import {A} from "./a"

export class B extends A {
    
    hello() {
        for (let x = 0; x < 10; x++) {
            if (x == 5)
                console.log("A")
        }
    }
}