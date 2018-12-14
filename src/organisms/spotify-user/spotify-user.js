import React from 'react';
import { AsyncUser, spotify } from 'src/providers/spotify';
import User from 'src/molecules/user';

export default function GithubUserOrganism() {
	return (
		<AsyncUser>
			<AsyncUser.Resolved>
				{data => {
					const avatarUrl = data.images && data.images[0] && data.images[0].url;
					const spotifyUrl = data.external_urls && data.external_urls.spotify;
					const followerTotal = data.followers && data.followers.total;
					return (
						<User
							name={data.display_name}
							username={data.id}
							avatarUrl={avatarUrl}
							description={`Followers ${followerTotal} - ${spotifyUrl}`}
						/>
					)}}
			</AsyncUser.Resolved>
			<AsyncUser.Rejected>
				{ error => spotify.logout() }
			</AsyncUser.Rejected>
		</AsyncUser>
	);
}
