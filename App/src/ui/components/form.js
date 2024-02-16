export default function LoginApp(props) {
	let submissionUrl = props.submissionUrl;

	return (
		<h1> What events would you like to observe? </h1>
		<form action={submissionUrl}>
			<div class="scope-group">
				<h3>these are a scope group</h3>
				<input type="checkbox" name="test" checked/>
				<label for="test">this is a </label>
			</div>
			<input type="submit" value="Submit" />
		</form>
	);
}
