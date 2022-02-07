<script>
import { Roles } from '~/constants'
export default {
  fetch ({ redirect, store: { state: { auth: { user } } } }) {
    if (user.role === Roles.ADMIN) {
      return redirect('/sites')
    }

    return redirect('/dashboard')
  }
}
</script>
