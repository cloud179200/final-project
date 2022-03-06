import { useParams } from "react-router"

interface Props { }
const UserDetailPage = (props: Props) => {
    const { id } = useParams<{id: string}>()
    return <>{id}</>
}
export default UserDetailPage