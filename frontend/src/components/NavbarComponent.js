import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

function NavbarComponent({ account, connectWallet }) {

    return (

        <Navbar bg="dark" variant="dark">

            <Container>

                <Navbar.Brand>

                    Crowdfunding DApp

                </Navbar.Brand>

                {

                    account ?

                    (

                        <Button variant="success">

                            {account.substring(0,6)}
                            ...
                            {account.substring(account.length-4)}

                        </Button>

                    )

                    :

                    (

                        <Button

                            variant="primary"

                            onClick={connectWallet}

                        >

                            Connect Wallet

                        </Button>

                    )

                }

            </Container>

        </Navbar>

    );

}

export default NavbarComponent;