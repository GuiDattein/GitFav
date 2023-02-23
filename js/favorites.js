import { GithubUser } from "./githubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem
            ('@github-favorites:')) || []
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try{
            const userExists = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)

            console.log(user)

            if(user.login === undefined){
                throw new Error('Usuário não encntrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        }catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries
           .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    noFav(){
        if(this.entries.length === 0){
            this.root.querySelector('.no-fav').classList.remove('hide')
        }else{
            this.root.querySelector('.no-fav').classList.add('hide')
        }
    }

    update(){
        this.removeAllTr()
        this.noFav()
        
        this.entries.forEach( user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de perfil de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = '/' + user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm("Deletar?")

                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/guidattein.png" alt="Foto de Guilherme">
            <a href="https://github.com/guidattein" target="_blank">
                <p>Guilherme Dattein</p>
                <span>/guidattein</span>
            </a>
        </td>
        <td class="repositories">
            123
        </td>
        <td class="followers">
            1234
        </td>
        <td class="action">
            <button class="remove">Remove</button>
        </td>
        `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}