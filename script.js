const list = document.querySelector('.list')
const form = document.querySelector('.form')
const form_input = document.querySelector('.form_input')
const form_add = document.querySelector('.form_add') // btn submit on form
const template = document.querySelector('#template_task')
const LOCALSTORAGE_PREFIX = 'TODOList_VER2-' // prefix localstorage/per proj
const TODOSSTORAGE_KEY = `${LOCALSTORAGE_PREFIX}-`
const tasks = loadTasks()
tasks.forEach(updateList)


// prevent space from being typed in the beggining
form_input.addEventListener('keydown', e => {
  if (form_input.value === '') {
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault()
    }
  }
})


list.addEventListener('change', e => {
  if (!e.target.matches('.list_item_checkbox')) return;

  const checkbox = e.target
  const listItem = checkbox.closest('.list_item_item')
  const taskId = listItem.id
  const task = tasks[taskId]


  task.checked = checkbox.checked

  saveTasks()
});



//add task event
form.addEventListener('submit', e => {
  e.preventDefault()// don't refresh page on submit

  if (form_input.value.trim() === '') return
  task = {
    description: form_input.value,
    checked: false
  }
  tasks.push(task)
  updateList(task)
  saveTasks()
  form_input.value = ''
})

function updateList(taskObj) {
  const templateInstance = template.content.cloneNode(true)
  const taskdescription = templateInstance.querySelector('.list_item_text')
  const taskListItem = templateInstance.querySelector('.list_item_item')
  const checkbox = templateInstance.querySelector('.list_item_checkbox')
  checkbox.checked = taskObj.checked

  const del = templateInstance.querySelector('.list_btn_delete');
  del.addEventListener('click', () => {
    removeTask(taskListItem);
  });

  const edit = templateInstance.querySelector('.list_btn_edit');
  edit.addEventListener('click', () => {
    editTask(taskListItem)
  })


  taskListItem.id = tasks.indexOf(taskObj);
  taskdescription.innerText = taskObj.description
  list.appendChild(templateInstance)
}

// save
function saveTasks() {
  localStorage.setItem(TODOSSTORAGE_KEY, JSON.stringify(tasks))
  // set localstorage the key and array converted to string to maintain array behaviour
}


// load
function loadTasks() {
  const tasksArrayString = localStorage.getItem(TODOSSTORAGE_KEY)
  return JSON.parse(tasksArrayString) || []
}

function removeTask(taskItem) {
  const taskId = taskItem.id
  tasks.splice(taskId, 1)
  saveTasks()
  taskItem.remove()
}

function editTask(taskItem) {
  const taskId = taskItem.id
  const taskObj = tasks[taskId]
  const newName = window.prompt('Edit task:', taskObj.description)

  if (newName !== null && newName !== '') {
    taskObj.description = newName
    saveTasks()
    taskItem.querySelector('.list_item_text').innerText = newName
  }
}