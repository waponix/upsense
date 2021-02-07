import 'reflect-metadata';

class App
{
    private loop: any;

    constructor()
    {
        this.loop = setInterval(() => {
            console.log('running');
        }, 1000)
    }
}

new App();
