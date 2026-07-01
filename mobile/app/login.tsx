import { useRouter } from 'expo-router';

import { useEffect } from 'react';

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { images } from '../src/assets';

import { DesignFrame } from '../src/components/DesignFrame';

import { ScreenShell } from '../src/components/ScreenShell';

import { isSignedIn, signInWithGoogle } from '../src/storage/session';

import { colors, layout, typography } from '../src/theme';



export default function LoginScreen() {

  const router = useRouter();



  useEffect(() => {

    if (isSignedIn()) {

      router.replace('/explore');

    }

  }, [router]);



  const handleSignIn = async () => {

    try {

      await signInWithGoogle();

      router.replace('/explore');

    } catch (err) {

      // User closed the popup or the domain isn't authorized — stay on login.

      console.warn('Google sign-in failed:', err);

    }

  };



  return (

    <DesignFrame>

      <ScreenShell

        colors={[colors.loginGradientStart, colors.white]}

        locations={[0, 0.6]}

      >

        <View style={styles.content}>

          <View style={styles.leavesClip} pointerEvents="none">

            <Image

              source={images.loginLeavesBg}

              style={styles.leavesBg}

              resizeMode="cover"

            />

          </View>

          <View style={styles.textBlock}>

            <Text style={styles.hello}>hello</Text>

            <Text style={styles.subtitle}>Start enjoying your teas</Text>

          </View>

          <Pressable

            style={styles.googleSignIn}

            onPress={handleSignIn}

            accessibilityRole="button"

            accessibilityLabel="Sign in with Google"

          >

            <Image

              source={images.loginGoogleSignIn}

              style={styles.googleSignInImage}

              resizeMode="contain"

            />

          </Pressable>

        </View>

      </ScreenShell>

    </DesignFrame>

  );

}



const styles = StyleSheet.create({

  content: {

    flex: 1,

    width: '100%',

  },

  leavesClip: {

    ...StyleSheet.absoluteFillObject,

    overflow: 'hidden',

  },

  leavesBg: {

    position: 'absolute',

    top: 0,

    left: '-0.05%',

    width: '121.89%',

    height: '100%',

  },

  textBlock: {

    position: 'absolute',

    top: layout.loginHelloTop,

    left: 0,

    right: 0,

    alignItems: 'center',

  },

  hello: {

    ...typography.loginHello,

    textAlign: 'center',

  },

  subtitle: {

    ...typography.loginSubtitle,

    textAlign: 'center',

    marginTop: layout.loginSubtitleGap,

  },

  googleSignIn: {

    position: 'absolute',

    top: layout.loginGoogleButtonTop,

    left: layout.loginGoogleButtonLeft,

    width: layout.loginGoogleButtonWidth,

    height: layout.loginGoogleButtonHeight,

  },

  googleSignInImage: {

    width: '100%',

    height: '100%',

  },

});


