//Lazily loaded user profile card

function UserCard({user}){
    return (
        <div className = "card">
            <h3>{user.name}</h3>
            <p>{user.bio}</p>
        </div>
    );
}

export default UserCard;