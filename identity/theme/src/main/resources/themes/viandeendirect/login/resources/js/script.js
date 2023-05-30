addUserTypeInput = () => {
    const client_id = new URL(window.location.href).searchParams.get('client_id')
    let userTypeInput = document.createElement('input')
    userTypeInput.name = 'userType'
    userTypeInput.type = 'hidden'
    userTypeInput.value = client_id === 'viandeendirect-producer-frontend' ? 'producer' : 'customer'
    document.querySelector('form').appendChild(userTypeInput)
}

window.onload = addUserTypeInput
