App = {

    loading: false,
    contracts: {}, //place to store contracts
    
    load: async () => {
        // Load app
        // console.log("app loading")
        await App.loadWeb3() //loadWeb3 defined below
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8

    //metamask loading to connect browser to blockchain
    //and Web3 library to connect client to blockchain
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */})
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */})
        }
        
        // Non-dapp browsers...
        else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async () => {
        App.account = web3.eth.accounts[0]
        // console.log(App.account)
    },

    loadContract: async () => {
        //javascript version of smart contract...
        // TodoList.sol gets compiled to TodoList.json which then is read by here?
        const todoList = await $.getJSON('TodoList.json')
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)
        
        // populate todolist with deployed contract from blockchain
        App.todoList = await App.contracts.TodoList.deployed()
    },

    toggleCompleted: async (e) => {
        App.setLoading(true)
        const taskID = e.target.name
        await App.todoList.toggleCompleted(taskID)
        window.location.reload()
    },

    render: async () => {

        if (App.loading){
            return
        }

        App.setLoading(true)

        //loads App.account defined in loadAccount to the account id in html.... beauty
        $('#account').html(App.account)

        await App.renderTasks()

        App.setLoading(false)
    },

    renderTasks: async () => {
        //Load tasks from blockchain
        const taskCount = await App.todoList.taskCount()
        const $taskTemplate = $('.taskTemplate')

        //render out each task with template
        for (var i = 1; i <= taskCount; i++){
            
            const task = App.todoList.tasks()
            const taskID = task[0]//.toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]

             //show task on page
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                            .prop('name', taskID)
                            .prop('checked', taskCompleted)
                            .on('click', App.toggleCompleted)

            if (taskCompleted){
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }

            $newTaskTemplate.show()

        }

       
        
    },

    createTasks: async () => {
        App.setLoading(true)
        const content = $('#newTask').val() //gets vale of input in client side web
        await App.todoList.createTask(content)

        //reload page to fetch new blockchain (bad programming)
        window.location.reload()
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
    }
    
}

//as the window loads, do app.load() defined above
$(() => {
    $(window).load(() => {
        App.load()
    })
})